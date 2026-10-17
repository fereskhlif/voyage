import { useMemo, useState } from "react";
import { tours } from "../data/tours";
import { circuits as circuitData, initialReservations, type Circuit, type Reservation } from "../data/platform";

type Props = {
  onBook: (destination: string) => void;
};

function SectionTitle({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <header className="platform-heading">
      <p>{label}</p>
      <h2>{title}</h2>
      <span>{text}</span>
    </header>
  );
}

function StatusBadge({ status }: { status: Reservation["status"] }) {
  return <span className={`status-badge status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

export default function TravelPlatform({ onBook }: Props) {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [reservations, setReservations] = useState(initialReservations);
  const [reservationFilter, setReservationFilter] = useState("Toutes");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [seatSelection, setSeatSelection] = useState(["2A", "2B"]);
  const [adminCircuits, setAdminCircuits] = useState(circuitData);
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);

  const visibleReservations = useMemo(
    () => reservations.filter((reservation) => reservationFilter === "Toutes" || reservation.status === reservationFilter),
    [reservationFilter, reservations],
  );

  const toggleSeat = (seat: string) => {
    setSeatSelection((current) =>
      current.includes(seat) ? current.filter((item) => item !== seat) : current.length < 4 ? [...current, seat] : current,
    );
  };

  const cancelReservation = () => {
    if (!cancelTarget) return;
    setReservations((current) =>
      current.map((item) => item.reference === cancelTarget.reference ? { ...item, status: "Annulée" } : item),
    );
    setSelectedReservation((current) => current?.reference === cancelTarget.reference ? { ...current, status: "Annulée" } : current);
    setCancelTarget(null);
  };

  const moveStep = (circuit: Circuit, index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= circuit.steps.length) return;
    const steps = [...circuit.steps];
    [steps[index], steps[nextIndex]] = [steps[nextIndex], steps[index]];
    const updated = { ...circuit, steps };
    setAdminCircuits((current) => current.map((item) => item.id === circuit.id ? updated : item));
    setEditingCircuit(updated);
  };

  return (
    <>
      <section id="voyages" className="platform-section platform-trips">
        <div className="platform-container">
          <SectionTitle
            label="Voyages"
            title="Des séjours pensés pour vous"
            text="Consultez les détails, les disponibilités simulées et réservez votre prochaine expérience."
          />
          <div className="platform-trip-grid">
            {tours.slice(0, 3).map((tour, index) => (
              <article className="platform-trip-card" key={tour.id}>
                <div className="platform-trip-image">
                  <img src={tour.image} alt={tour.title} />
                  <span className={index === 2 ? "availability-low" : ""}>
                    {index === 2 ? "3 places restantes" : "Disponible"}
                  </span>
                </div>
                <div className="platform-trip-body">
                  <small>{tour.type} · {tour.durationDays} jours</small>
                  <h3>{tour.title}</h3>
                  <p>Hôtel, petit-déjeuner, transferts et accompagnement par un guide local inclus.</p>
                  <div>
                    <strong>À partir de {tour.pricePerPerson.toLocaleString("fr-FR")} DT</strong>
                    <button type="button" onClick={() => onBook(tour.destination)}>Voir les détails</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="circuits" className="platform-section circuits-section">
        <div className="platform-container">
          <SectionTitle
            label="Circuits touristiques"
            title="Explorez la Tunisie autrement"
            text="Des itinéraires chronologiques avec horaires, distances et lieux incontournables."
          />
          <div className="circuit-grid">
            {circuitData.map((circuit) => (
              <article className="circuit-card" key={circuit.id}>
                <img src={circuit.image} alt={circuit.name} />
                <div>
                  <small>{circuit.location}</small>
                  <h3>{circuit.name}</h3>
                  <p>{circuit.description}</p>
                  <ul>
                    <li>{circuit.steps.length} étapes</li>
                    <li>{circuit.duration}</li>
                    <li>{circuit.distance}</li>
                  </ul>
                  <button type="button" onClick={() => setSelectedCircuit(circuit)}>Découvrir le circuit</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reservations" className="platform-section reservations-section">
        <div className="platform-container">
          <div className="platform-title-row">
            <SectionTitle
              label="Espace personnel"
              title="Mes réservations"
              text="Suivez vos voyages, consultez vos voyageurs et gérez les actions autorisées."
            />
            <label className="platform-filter">
              <span>Filtrer par statut</span>
              <select value={reservationFilter} onChange={(event) => setReservationFilter(event.target.value)}>
                {["Toutes", "En attente", "Confirmée", "Annulée"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <div className="reservation-list">
            {visibleReservations.map((reservation) => (
              <article className="reservation-row" key={reservation.reference}>
                <div><small>Référence</small><strong>{reservation.reference}</strong></div>
                <div><small>Destination</small><strong>{reservation.destination}</strong></div>
                <div><small>Dates</small><strong>{reservation.dates}</strong></div>
                <div><small>Voyageurs</small><strong>{reservation.travelers}</strong></div>
                <div><small>Montant</small><strong>{reservation.amount.toLocaleString("fr-FR")} DT</strong></div>
                <StatusBadge status={reservation.status} />
                <button type="button" onClick={() => setSelectedReservation(reservation)}>Détails</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="billets" className="platform-section tickets-section">
        <div className="platform-container">
          <SectionTitle
            label="Billets électroniques"
            title="Mes billets"
            text="Billets de démonstration associés à vos réservations confirmées."
          />
          <article className="e-ticket">
            <div className="ticket-brand"><span>TOUR</span><small>Billet électronique — démonstration</small></div>
            <div className="ticket-route">
              <div><small>Départ</small><strong>Tunis</strong><span>TUN</span></div>
              <div className="ticket-line"><span>✈</span></div>
              <div><small>Destination</small><strong>Djerba</strong><span>DJE</span></div>
            </div>
            <div className="ticket-details">
              <div><small>Voyageur</small><strong>Amira Ben Salah</strong></div>
              <div><small>Date</small><strong>12 juin 2026</strong></div>
              <div><small>Réservation</small><strong>TOUR-2026-48215</strong></div>
              <div><small>Place</small><strong>2A</strong></div>
            </div>
            <div className="ticket-qr" aria-label="QR code illustratif">
              {Array.from({ length: 49 }, (_, index) => <i key={index} className={index % 3 === 0 || index % 7 === 0 ? "dark" : ""} />)}
              <small>QR illustratif</small>
            </div>
            <button type="button" onClick={() => window.alert("Téléchargement simulé dans cette démonstration.")}>
              Télécharger le billet
            </button>
          </article>
        </div>
      </section>

      <section id="admin-circuits" className="platform-section admin-section">
        <div className="platform-container">
          <div className="admin-heading">
            <div>
              <p>Interface dédiée</p>
              <h2>Administration des circuits</h2>
              <span>Gestion simulée — aucune donnée réelle n’est modifiée.</span>
            </div>
            <button type="button" onClick={() => setEditingCircuit({
              id: `nouveau-${Date.now()}`, name: "Nouveau circuit", location: "Tunisie", description: "Description à compléter",
              duration: "0 h", distance: "0 km", image: circuitData[0].image, linkedTrip: "Aucun voyage associé", steps: [],
            })}>Créer un circuit</button>
          </div>
          <div className="admin-table">
            <div className="admin-table-head"><span>Circuit</span><span>Étapes</span><span>Durée</span><span>Voyage associé</span><span>Actions</span></div>
            {adminCircuits.map((circuit) => (
              <div className="admin-table-row" key={circuit.id}>
                <strong>{circuit.name}<small>{circuit.location}</small></strong>
                <span>{circuit.steps.length}</span>
                <span>{circuit.duration} · {circuit.distance}</span>
                <span>{circuit.linkedTrip}</span>
                <div>
                  <button type="button" onClick={() => setEditingCircuit(circuit)}>Modifier</button>
                  <button type="button" onClick={() => {
                    if (window.confirm("Supprimer ce circuit de démonstration ?")) {
                      setAdminCircuits((current) => current.filter((item) => item.id !== circuit.id));
                    }
                  }}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCircuit && (
        <div className="platform-modal-backdrop" onMouseDown={() => setSelectedCircuit(null)}>
          <section className="circuit-detail-modal" role="dialog" aria-modal="true" aria-labelledby="circuit-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="platform-close" type="button" onClick={() => setSelectedCircuit(null)} aria-label="Fermer">×</button>
            <img src={selectedCircuit.image} alt="" />
            <div className="circuit-detail-content">
              <small>{selectedCircuit.location} · {selectedCircuit.duration} · {selectedCircuit.distance}</small>
              <h2 id="circuit-title">{selectedCircuit.name}</h2>
              <p>{selectedCircuit.description}</p>
              <div className="circuit-timeline">
                {selectedCircuit.steps.map((step, index) => (
                  <div key={step.name} className={index === 0 ? "timeline-start" : index === selectedCircuit.steps.length - 1 ? "timeline-end" : ""}>
                    <b>{index + 1}</b>
                    <article>
                      <span>{step.time} · {step.duration} · {step.distance}</span>
                      <h3>{step.name}</h3>
                      <p>{step.description}</p>
                    </article>
                  </div>
                ))}
              </div>
              <div className="linked-trip">
                <span>Voyage associé</span><strong>{selectedCircuit.linkedTrip}</strong>
                <button type="button" onClick={() => { setSelectedCircuit(null); onBook(selectedCircuit.location); }}>Réserver le voyage</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedReservation && (
        <div className="platform-modal-backdrop" onMouseDown={() => setSelectedReservation(null)}>
          <section className="reservation-detail-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="platform-close" type="button" onClick={() => setSelectedReservation(null)} aria-label="Fermer">×</button>
            <small>Réservation {selectedReservation.reference}</small>
            <h2 id="reservation-title">{selectedReservation.destination}</h2>
            <StatusBadge status={selectedReservation.status} />
            <div className="reservation-detail-grid">
              <div><span>Dates</span><strong>{selectedReservation.dates}</strong></div>
              <div><span>Prix total</span><strong>{selectedReservation.amount.toLocaleString("fr-FR")} DT</strong></div>
            </div>
            <h3>Voyageurs</h3>
            {selectedReservation.names.map((name, index) => <div className="traveler-row" key={name}><span>{index === 0 ? "Voyageur principal" : `Voyageur ${index + 1}`}</span><strong>{name}</strong><button type="button">Modifier</button></div>)}
            <h3>Sélection des places</h3>
            <div className="seat-legend"><span><i />Disponible</span><span><i className="selected" />Sélectionnée</span><span><i className="occupied" />Occupée</span></div>
            <div className="seat-map">
              {["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D"].map((seat, index) => {
                const occupied = [1, 2, 7].includes(index);
                return <button type="button" key={seat} disabled={occupied || selectedReservation.status === "Annulée"} className={occupied ? "occupied" : seatSelection.includes(seat) ? "selected" : ""} onClick={() => toggleSeat(seat)}>{seat}</button>;
              })}
            </div>
            <div className="seat-hold"><span>Places temporairement bloquées</span><strong>09:42</strong><small>Compte à rebours illustratif</small></div>
            <div className="reservation-actions">
              <button type="button" disabled={selectedReservation.status === "Annulée"}>Enregistrer les modifications</button>
              <button type="button" disabled={selectedReservation.status === "Annulée"} onClick={() => setCancelTarget(selectedReservation)}>Annuler la réservation</button>
            </div>
          </section>
        </div>
      )}

      {cancelTarget && (
        <div className="platform-modal-backdrop">
          <section className="confirm-dialog" role="alertdialog" aria-modal="true">
            <span>!</span><h2>Confirmer l’annulation ?</h2>
            <p>Cette action est une simulation visuelle. La réservation {cancelTarget.reference} passera au statut « Annulée ».</p>
            <div><button type="button" onClick={() => setCancelTarget(null)}>Retour</button><button type="button" onClick={cancelReservation}>Confirmer l’annulation</button></div>
          </section>
        </div>
      )}

      {editingCircuit && (
        <div className="platform-modal-backdrop" onMouseDown={() => setEditingCircuit(null)}>
          <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="platform-close" type="button" onClick={() => setEditingCircuit(null)} aria-label="Fermer">×</button>
            <p>Éditeur de démonstration</p><h2 id="editor-title">{editingCircuit.name}</h2>
            <div className="admin-form-grid">
              <label>Nom du circuit<input value={editingCircuit.name} onChange={(event) => setEditingCircuit({ ...editingCircuit, name: event.target.value })} /></label>
              <label>Destination<input value={editingCircuit.location} onChange={(event) => setEditingCircuit({ ...editingCircuit, location: event.target.value })} /></label>
              <label>Durée totale<input value={editingCircuit.duration} onChange={(event) => setEditingCircuit({ ...editingCircuit, duration: event.target.value })} /></label>
              <label>Distance totale<input value={editingCircuit.distance} onChange={(event) => setEditingCircuit({ ...editingCircuit, distance: event.target.value })} /></label>
              <label className="admin-form-wide">Voyage associé<select value={editingCircuit.linkedTrip} onChange={(event) => setEditingCircuit({ ...editingCircuit, linkedTrip: event.target.value })}><option>Aucun voyage associé</option><option>Escapade culturelle à Tunis</option><option>Séjour détente à Djerba</option></select></label>
            </div>
            <h3>Étapes du circuit</h3>
            <div className="admin-steps">
              {editingCircuit.steps.map((step, index) => <div key={step.name}><b>{index + 1}</b><span><strong>{step.name}</strong><small>{step.time} · {step.distance}</small></span><button type="button" onClick={() => moveStep(editingCircuit, index, -1)} disabled={index === 0}>↑</button><button type="button" onClick={() => moveStep(editingCircuit, index, 1)} disabled={index === editingCircuit.steps.length - 1}>↓</button><button type="button" onClick={() => setEditingCircuit({ ...editingCircuit, steps: editingCircuit.steps.filter((_, stepIndex) => stepIndex !== index) })}>×</button></div>)}
              <button type="button" onClick={() => setEditingCircuit({ ...editingCircuit, steps: [...editingCircuit.steps, { name: "Nouvelle étape", time: "10:00", duration: "1 h", distance: "0 km", description: "À compléter" }] })}>+ Ajouter une étape</button>
            </div>
            <button className="admin-save" type="button" onClick={() => {
              setAdminCircuits((current) => current.some((item) => item.id === editingCircuit.id) ? current.map((item) => item.id === editingCircuit.id ? editingCircuit : item) : [...current, editingCircuit]);
              setEditingCircuit(null);
            }}>Enregistrer le circuit</button>
          </section>
        </div>
      )}
    </>
  );
}
