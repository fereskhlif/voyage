import { useMemo, useState } from "react";
import { createBooking, searchAvailableTours, type BookingRequest } from "../api/bookings";
import { ArrowIcon, PageHeader } from "../components/SiteParts";
import { categoryLabels, destinations, tours, type Tour } from "../data/tours";
import type { BookingPrefill, SharedPageProps } from "./types";

type Props = SharedPageProps & { prefill: BookingPrefill };

const today = new Date().toISOString().split("T")[0];
const formatDate = (value: string) => value
  ? new Intl.DateTimeFormat("fr-TN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`))
  : "Date à définir";

export default function BookingPage({ navigate, prefill }: Props) {
  const [booking, setBooking] = useState<BookingRequest>({
    destination: prefill.destination,
    departureDate: prefill.departureDate || "",
    returnDate: prefill.returnDate || "",
    adults: prefill.adults || 1,
    children: 0,
    tourType: prefill.tourType,
    selectedTour: prefill.selectedTour || null,
    customer: { fullName: "", email: "", phoneCode: "+216", phone: "", specialRequests: "", travelerNames: [] },
    reference: "",
  });
  const [searched, setSearched] = useState(!!prefill.selectedTour);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"traveler" | "review" | "confirmation">("traveler");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const matching = useMemo(() => tours.filter((tour) => tour.destination === booking.destination && (!booking.tourType || tour.type === booking.tourType)), [booking.destination, booking.tourType]);
  const tour = booking.selectedTour;
  const travelers = booking.adults + booking.children;
  const subtotal = tour ? tour.pricePerPerson * booking.adults + tour.pricePerPerson * 0.5 * booking.children : 0;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  const update = (changes: Partial<BookingRequest>) => setBooking((current) => ({ ...current, ...changes }));
  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!booking.destination || !booking.departureDate || !booking.returnDate || booking.returnDate <= booking.departureDate) return;
    setLoading(true);
    await searchAvailableTours();
    setSearched(true);
    setLoading(false);
    window.setTimeout(() => document.querySelector("#available-tours")?.scrollIntoView({ behavior: "smooth" }), 30);
  };
  const selectTour = (selectedTour: Tour) => {
    update({ selectedTour, customer: { ...booking.customer, travelerNames: Array.from({ length: travelers }, () => "") } });
    setStage("traveler");
    window.setTimeout(() => document.querySelector("#booking-flow")?.scrollIntoView({ behavior: "smooth" }), 30);
  };
  const validateTraveler = () => {
    const next: Record<string, string> = {};
    if (!booking.departureDate || !booking.returnDate || booking.returnDate <= booking.departureDate) {
      next.dates = "Renseignez des dates de voyage valides dans le formulaire ci-dessus.";
    }
    if (!booking.customer.fullName.trim()) next.name = "Le nom complet est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.customer.email)) next.email = "Saisissez une adresse e-mail valide.";
    if (!/^[0-9\s-]{6,15}$/.test(booking.customer.phone)) next.phone = "Saisissez un numéro valide.";
    booking.customer.travelerNames.forEach((name, index) => { if (!name.trim()) next[`traveler-${index}`] = "Le nom du voyageur est requis."; });
    setErrors(next);
    if (!Object.keys(next).length) setStage("review");
  };
  const confirm = async () => {
    if (!terms) return;
    setLoading(true);
    const response = await createBooking(booking);
    update({ reference: response.reference });
    setLoading(false);
    setStage("confirmation");
  };

  return (
    <>
      <PageHeader title="Réservation" current="Réservation" />
      <main className="booking-page">
        <section className="booking-search-layout">
          <div><p>Votre prochain départ</p><h2>Planifiez votre aventure</h2><span>Choisissez vos critères pour afficher les circuits disponibles. Toutes les données présentées sont fictives.</span></div>
          <form className="booking-form-page" onSubmit={search}>
            <label>Destination<select required value={booking.destination} onChange={(event) => update({ destination: event.target.value, selectedTour: null })}><option value="">Choisissez votre destination</option>{destinations.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <div className="form-columns"><label>Date de départ<input required type="date" min={today} value={booking.departureDate} onChange={(event) => update({ departureDate: event.target.value })} /></label><label>Date de retour<input required type="date" min={booking.departureDate || today} value={booking.returnDate} onChange={(event) => update({ returnDate: event.target.value })} /></label></div>
            <div className="form-columns"><label>Adultes<select value={booking.adults} onChange={(event) => update({ adults: Number(event.target.value) })}>{Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count}>{count}</option>)}</select></label><label>Enfants<select value={booking.children} onChange={(event) => update({ children: Number(event.target.value) })}>{Array.from({ length: 7 }, (_, index) => index).map((count) => <option key={count}>{count}</option>)}</select></label></div>
            <label>Type de circuit<select value={booking.tourType} onChange={(event) => update({ tourType: event.target.value })}><option value="">Tous les types</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <button type="submit" disabled={loading}>{loading && !tour ? <i className="spinner" /> : <ArrowIcon />}Rechercher un voyage</button>
          </form>
        </section>

        {searched && !tour && <section id="available-tours" className="available-tours"><h2>Circuits disponibles</h2>{matching.length ? <div>{matching.map((item) => <article key={item.id}><img src={item.image} alt="" /><div><small>{categoryLabels[item.type]} · {item.durationDays} jours</small><h3>{item.title}</h3><p>{item.included.join(" · ")}</p><span>★ {item.rating.toFixed(1)} · {item.availability} places restantes</span></div><aside><strong>{item.pricePerPerson.toLocaleString("fr-FR")} DT</strong><small>par personne</small><button type="button" onClick={() => selectTour(item)}>Choisir ce circuit</button></aside></article>)}</div> : <div className="empty-state"><h3>Aucun voyage trouvé</h3><p>Essayez d’autres dates ou retirez le filtre de type.</p></div>}</section>}

        {tour && <section id="booking-flow" className="booking-flow-page">
          <div className="progress-steps">{["Voyageurs", "Récapitulatif", "Confirmation"].map((label, index) => { const current = stage === "traveler" ? 0 : stage === "review" ? 1 : 2; return <div className={current >= index ? "active" : ""} key={label}><b>{index + 1}</b><span>{label}</span></div>; })}</div>
          {stage === "traveler" && <div className="flow-panel"><p>Étape 1 sur 3</p><h2>Informations des voyageurs</h2><div className="selected-tour-mini"><img src={tour.image} alt="" /><div><small>{categoryLabels[tour.type]}</small><strong>{tour.title}</strong><span>{tour.pricePerPerson.toLocaleString("fr-FR")} DT / personne</span></div></div>{errors.dates && <p className="flow-error" role="alert">{errors.dates}</p>}<div className="traveler-form-grid"><label>Nom du contact<input value={booking.customer.fullName} onChange={(event) => update({ customer: { ...booking.customer, fullName: event.target.value } })} />{errors.name && <small>{errors.name}</small>}</label><label>Adresse e-mail<input type="email" value={booking.customer.email} onChange={(event) => update({ customer: { ...booking.customer, email: event.target.value } })} />{errors.email && <small>{errors.email}</small>}</label><label>Indicatif et téléphone<div className="phone-combo"><select value={booking.customer.phoneCode} onChange={(event) => update({ customer: { ...booking.customer, phoneCode: event.target.value } })}><option>+216</option><option>+33</option><option>+1</option></select><input value={booking.customer.phone} onChange={(event) => update({ customer: { ...booking.customer, phone: event.target.value } })} /></div>{errors.phone && <small>{errors.phone}</small>}</label><label>Demandes particulières<textarea value={booking.customer.specialRequests} onChange={(event) => update({ customer: { ...booking.customer, specialRequests: event.target.value } })} /></label></div><div className="traveler-names-page"><h3>Noms des voyageurs</h3>{Array.from({ length: travelers }, (_, index) => <label key={index}>Voyageur {index + 1} {index < booking.adults ? "(adulte)" : "(enfant)"}<input value={booking.customer.travelerNames[index] || ""} onChange={(event) => { const names = [...booking.customer.travelerNames]; names[index] = event.target.value; update({ customer: { ...booking.customer, travelerNames: names } }); }} />{errors[`traveler-${index}`] && <small>{errors[`traveler-${index}`]}</small>}</label>)}</div><button className="primary-wide" type="button" onClick={validateTraveler}>Continuer vers le récapitulatif <ArrowIcon /></button></div>}
          {stage === "review" && <div className="flow-panel"><p>Étape 2 sur 3</p><h2>Récapitulatif de votre réservation</h2><div className="review-summary"><div><h3>{tour.title}</h3><span>{formatDate(booking.departureDate)} → {formatDate(booking.returnDate)}</span><span>{travelers} voyageur{travelers > 1 ? "s" : ""}</span></div><div className="price-lines"><p><span>Adultes ({booking.adults})</span><strong>{(tour.pricePerPerson * booking.adults).toLocaleString("fr-FR")} DT</strong></p><p><span>Enfants ({booking.children})</span><strong>{(tour.pricePerPerson * 0.5 * booking.children).toLocaleString("fr-FR")} DT</strong></p><p><span>Taxes et frais (10 %)</span><strong>{taxes.toLocaleString("fr-FR")} DT</strong></p><p><span>Total</span><strong>{total.toLocaleString("fr-FR")} DT</strong></p></div></div><label className="terms-line"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />J’accepte les conditions et la politique d’annulation.</label><div className="flow-actions"><button type="button" onClick={() => setStage("traveler")}>Retour</button><button type="button" disabled={!terms || loading} onClick={confirm}>{loading ? <i className="spinner" /> : null}Confirmer la réservation</button></div></div>}
          {stage === "confirmation" && <div className="flow-panel confirmation-panel"><i>✓</i><h2>Réservation confirmée !</h2><p>Votre voyage est réservé. Un récapitulatif a été envoyé à {booking.customer.email}.</p><div><small>Référence de réservation</small><strong>{booking.reference}</strong></div><h3>{tour.title}</h3><span>Total : {total.toLocaleString("fr-FR")} DT</span><button type="button" onClick={() => navigate("home")}>Retour à l’accueil</button></div>}
        </section>}
      </main>
    </>
  );
}
