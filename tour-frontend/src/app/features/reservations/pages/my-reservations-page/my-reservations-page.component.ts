import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/site-parts/site-parts.component';
import { ReservationService } from '../../../../core/services/reservation.service';
import { circuits, initialReservations } from '../../../../shared/data/platform.mock';
import { tours } from '../../../../shared/data/tours.mock';
import { type Reservation } from '../../../../core/models/reservation.model';
import { type Circuit } from '../../../../core/models/circuit.model';

type FilterStatus = 'Toutes' | 'En attente' | 'Confirmée' | 'Annulée';

@Component({
  selector: 'app-my-reservations-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass, PageHeaderComponent],
  template: `
    <app-page-header title="Mes réservations" current="Réservations" />

    <!-- ── Voyages ── -->
    <section id="voyages" class="platform-section platform-trips">
      <div class="platform-container">
        <header class="platform-heading">
          <p>Voyages</p>
          <h2>Des séjours pensés pour vous</h2>
          <span>Consultez les détails, les disponibilités simulées et réservez votre prochaine expérience.</span>
        </header>
        <div class="platform-trip-grid">
          <article class="platform-trip-card" *ngFor="let t of featuredTrips; let i = index">
            <div class="platform-trip-image">
              <img [src]="t.image" [alt]="t.title" loading="lazy" />
              <span [class.availability-low]="i === 2">{{ i === 2 ? '3 places restantes' : 'Disponible' }}</span>
            </div>
            <div class="platform-trip-body">
              <small>{{ t.type }} · {{ t.durationDays }} jours</small>
              <h3>{{ t.title }}</h3>
              <p>Hôtel, petit-déjeuner, transferts et accompagnement par un guide local inclus.</p>
              <div>
                <strong>À partir de {{ t.pricePerPerson.toLocaleString('fr-FR') }} DT</strong>
                <button type="button" (click)="goToBooking(t)">Voir les détails</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Circuits ── -->
    <section id="circuits" class="platform-section circuits-section">
      <div class="platform-container">
        <header class="platform-heading">
          <p>Circuits touristiques</p>
          <h2>Explorez la Tunisie autrement</h2>
          <span>Des itinéraires chronologiques avec horaires, distances et lieux incontournables.</span>
        </header>
        <div class="circuit-grid">
          <article class="circuit-card" *ngFor="let c of allCircuits">
            <img [src]="c.image" [alt]="c.name" loading="lazy" />
            <div>
              <small>{{ c.location }}</small>
              <h3>{{ c.name }}</h3>
              <p>{{ c.description }}</p>
              <ul>
                <li>{{ c.steps.length }} étapes</li>
                <li>{{ c.duration }}</li>
                <li>{{ c.distance }}</li>
              </ul>
              <button type="button" (click)="openCircuit(c)">Découvrir le circuit</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Mes réservations ── -->
    <section id="reservations" class="platform-section reservations-section">
      <div class="platform-container">
        <div class="platform-title-row">
          <header class="platform-heading" style="margin-bottom:0">
            <p>Espace personnel</p>
            <h2>Mes réservations</h2>
            <span>Suivez vos voyages, consultez vos voyageurs et gérez les actions autorisées.</span>
          </header>
          <label class="platform-filter">
            Filtrer par statut
            <select [(ngModel)]="statusFilter">
              <option *ngFor="let s of statusOptions" [value]="s">{{ s }}</option>
            </select>
          </label>
        </div>
        <div class="reservation-list">
          <article class="reservation-row" *ngFor="let r of filteredReservations()">
            <div><small>Référence</small><strong>{{ r.reference }}</strong></div>
            <div><small>Destination</small><strong>{{ r.destination }}</strong></div>
            <div><small>Dates</small><strong>{{ r.dates }}</strong></div>
            <div><small>Voyageurs</small><strong>{{ r.travelers }}</strong></div>
            <div><small>Montant</small><strong>{{ r.amount.toLocaleString('fr-FR') }} DT</strong></div>
            <span class="status-badge" [ngClass]="statusClass(r.status)">{{ r.status }}</span>
            <button type="button" (click)="openReservation(r)">Détails</button>
          </article>
        </div>
      </div>
    </section>

    <!-- ── Billet électronique ── -->
    <section id="billets" class="platform-section tickets-section">
      <div class="platform-container">
        <header class="platform-heading">
          <p>Billets électroniques</p>
          <h2>Mes billets</h2>
          <span>Billets de démonstration associés à vos réservations confirmées.</span>
        </header>
        <article class="e-ticket">
          <div class="ticket-brand"><span>TOUR</span><small>Billet électronique — démonstration</small></div>
          <div class="ticket-route">
            <div><small>Départ</small><strong>Tunis</strong><span>TUN</span></div>
            <div class="ticket-line"><span>✈</span></div>
            <div><small>Destination</small><strong>Djerba</strong><span>DJE</span></div>
          </div>
          <div class="ticket-details">
            <div><small>Voyageur</small><strong>Amira Ben Salah</strong></div>
            <div><small>Date</small><strong>12 juin 2026</strong></div>
            <div><small>Réservation</small><strong>TOUR-2026-48215</strong></div>
            <div><small>Place</small><strong>2A</strong></div>
          </div>
          <div class="ticket-qr" aria-label="QR code illustratif">
            <i *ngFor="let cell of qrCells; let i = index" [class.dark]="i % 3 === 0 || i % 7 === 0"></i>
            <small>QR illustratif</small>
          </div>
          <button type="button" (click)="showTicketAlert()">Télécharger le billet</button>
        </article>
      </div>
    </section>

    <!-- ── Admin circuits ── -->
    <section id="admin-circuits" class="platform-section admin-section">
      <div class="platform-container">
        <div class="admin-heading">
          <div>
            <p>Interface dédiée</p>
            <h2>Administration des circuits</h2>
            <span>Gestion simulée — aucune donnée réelle n'est modifiée.</span>
          </div>
          <button type="button" (click)="createCircuit()">Créer un circuit</button>
        </div>
        <div class="admin-table">
          <div class="admin-table-head"><span>Circuit</span><span>Étapes</span><span>Durée</span><span>Voyage associé</span><span>Actions</span></div>
          <div class="admin-table-row" *ngFor="let c of adminCircuits()">
            <strong>{{ c.name }}<small>{{ c.location }}</small></strong>
            <span>{{ c.steps.length }}</span>
            <span>{{ c.duration }} · {{ c.distance }}</span>
            <span>{{ c.linkedTrip }}</span>
            <div>
              <button type="button" (click)="openEditCircuit(c)">Modifier</button>
              <button type="button" (click)="deleteCircuit(c.id)">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Modal Détail circuit ── -->
    <div *ngIf="selectedCircuit" class="platform-modal-backdrop" (mousedown)="selectedCircuit = null">
      <section class="circuit-detail-modal" role="dialog" aria-modal="true" aria-labelledby="circuit-title" (mousedown)="$event.stopPropagation()">
        <button class="platform-close" type="button" (click)="selectedCircuit = null" aria-label="Fermer">×</button>
        <img [src]="selectedCircuit.image" alt="" />
        <div class="circuit-detail-content">
          <small>{{ selectedCircuit.location }} · {{ selectedCircuit.duration }} · {{ selectedCircuit.distance }}</small>
          <h2 id="circuit-title">{{ selectedCircuit.name }}</h2>
          <p>{{ selectedCircuit.description }}</p>
          <div class="circuit-timeline">
            <div *ngFor="let step of selectedCircuit.steps; let i = index">
              <b>{{ i + 1 }}</b>
              <article>
                <span>{{ step.time }} · {{ step.duration }} · {{ step.distance }}</span>
                <h3>{{ step.name }}</h3>
                <p>{{ step.description }}</p>
              </article>
            </div>
          </div>
          <div class="linked-trip">
            <span>Voyage associé</span>
            <strong>{{ selectedCircuit.linkedTrip }}</strong>
            <button type="button" (click)="selectedCircuit = null; router.navigate(['/reservation'])">Réserver le voyage</button>
          </div>
        </div>
      </section>
    </div>

    <!-- ── Modal Détail réservation ── -->
    <div *ngIf="selectedReservation" class="platform-modal-backdrop" (mousedown)="selectedReservation = null">
      <section class="reservation-detail-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title" (mousedown)="$event.stopPropagation()">
        <button class="platform-close" type="button" (click)="selectedReservation = null" aria-label="Fermer">×</button>
        <small>Réservation {{ selectedReservation.reference }}</small>
        <h2 id="reservation-title">{{ selectedReservation.destination }}</h2>
        <span class="status-badge" [ngClass]="statusClass(selectedReservation.status)">{{ selectedReservation.status }}</span>
        <div class="reservation-detail-grid">
          <div><span>Dates</span><strong>{{ selectedReservation.dates }}</strong></div>
          <div><span>Prix total</span><strong>{{ selectedReservation.amount.toLocaleString('fr-FR') }} DT</strong></div>
        </div>
        <h3>Voyageurs</h3>
        <div *ngFor="let name of selectedReservation.names; let i = index" class="traveler-row">
          <span>{{ i === 0 ? 'Voyageur principal' : 'Voyageur ' + (i + 1) }}</span>
          <strong>{{ name }}</strong>
          <button type="button">Modifier</button>
        </div>
        <h3>Sélection des places</h3>
        <div class="seat-legend">
          <span><i></i>Disponible</span>
          <span><i class="selected"></i>Sélectionnée</span>
          <span><i class="occupied"></i>Occupée</span>
        </div>
        <div class="seat-map">
          <button
            *ngFor="let seat of seats; let i = index"
            type="button"
            [disabled]="occupiedSeats.includes(i) || selectedReservation.status === 'Annulée'"
            [class.occupied]="occupiedSeats.includes(i)"
            [class.selected]="selectedSeats().includes(seat)"
            (click)="toggleSeat(seat)"
          >{{ seat }}</button>
        </div>
        <div class="seat-hold">
          <span>Places temporairement bloquées</span><strong>09:42</strong><small>Compte à rebours illustratif</small>
        </div>
        <div class="reservation-actions">
          <button type="button" [disabled]="selectedReservation.status === 'Annulée'">Enregistrer les modifications</button>
          <button type="button" [disabled]="selectedReservation.status === 'Annulée'" (click)="confirmCancel()">Annuler la réservation</button>
        </div>
      </section>
    </div>

    <!-- ── Confirm annulation ── -->
    <div *ngIf="cancelTarget" class="platform-modal-backdrop">
      <section class="confirm-dialog" role="alertdialog" aria-modal="true">
        <span>!</span>
        <h2>Confirmer l'annulation ?</h2>
        <p>Cette action est une simulation visuelle. La réservation {{ cancelTarget.reference }} passera au statut « Annulée ».</p>
        <div>
          <button type="button" (click)="cancelTarget = null">Retour</button>
          <button type="button" (click)="doCancel()">Confirmer l'annulation</button>
        </div>
      </section>
    </div>

    <!-- ── Admin editor ── -->
    <div *ngIf="editingCircuit" class="platform-modal-backdrop" (mousedown)="editingCircuit = null">
      <section class="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title" (mousedown)="$event.stopPropagation()">
        <button class="platform-close" type="button" (click)="editingCircuit = null" aria-label="Fermer">×</button>
        <p>Éditeur de démonstration</p>
        <h2 id="editor-title">{{ editingCircuit.name }}</h2>
        <div class="admin-form-grid">
          <label>Nom du circuit<input [(ngModel)]="editingCircuit.name" /></label>
          <label>Destination<input [(ngModel)]="editingCircuit.location" /></label>
          <label>Durée totale<input [(ngModel)]="editingCircuit.duration" /></label>
          <label>Distance totale<input [(ngModel)]="editingCircuit.distance" /></label>
          <label class="admin-form-wide">
            Voyage associé
            <select [(ngModel)]="editingCircuit.linkedTrip">
              <option>Aucun voyage associé</option>
              <option>Escapade culturelle à Tunis</option>
              <option>Séjour détente à Djerba</option>
            </select>
          </label>
        </div>
        <h3>Étapes du circuit</h3>
        <div class="admin-steps">
          <div *ngFor="let step of editingCircuit.steps; let i = index">
            <b>{{ i + 1 }}</b>
            <span><strong>{{ step.name }}</strong><small>{{ step.time }} · {{ step.distance }}</small></span>
            <button type="button" [disabled]="i === 0" (click)="moveStep(i, -1)">↑</button>
            <button type="button" [disabled]="i === editingCircuit.steps.length - 1" (click)="moveStep(i, 1)">↓</button>
            <button type="button" (click)="removeStep(i)">×</button>
          </div>
          <button type="button" (click)="addStep()">+ Ajouter une étape</button>
        </div>
        <button class="admin-save" type="button" (click)="saveCircuit()">Enregistrer le circuit</button>
      </section>
    </div>
  `,
})
export class MyReservationsPageComponent implements OnInit {
  readonly qrCells = Array.from({ length: 49 });
  readonly seats = ['1A','1B','1C','1D','2A','2B','2C','2D','3A','3B','3C','3D'];
  readonly occupiedSeats = [1, 2, 7];
  readonly statusOptions: FilterStatus[] = ['Toutes', 'En attente', 'Confirmée', 'Annulée'];
  readonly allCircuits = circuits;
  readonly featuredTrips = tours.slice(0, 3);

  statusFilter: FilterStatus = 'Toutes';
  reservations: Reservation[] = [];
  selectedCircuit: Circuit | null = null;
  selectedReservation: Reservation | null = null;
  cancelTarget: Reservation | null = null;
  editingCircuit: Circuit | null = null;

  private _adminCircuits = signal<Circuit[]>([...circuits]);
  readonly adminCircuits = this._adminCircuits.asReadonly();

  private _selectedSeats = signal(['2A', '2B']);
  readonly selectedSeats = this._selectedSeats.asReadonly();

  constructor(private reservationService: ReservationService, readonly router: Router) {}

  ngOnInit(): void {
    this.reservationService.getAll().subscribe((r) => (this.reservations = r));
  }

  filteredReservations = computed(() =>
    this.reservations.filter((r) => this.statusFilter === 'Toutes' || r.status === this.statusFilter)
  );

  statusClass(status: string): Record<string, boolean> {
    return {
      'status-en-attente': status === 'En attente',
      'status-confirmée': status === 'Confirmée',
      'status-annulée': status === 'Annulée',
    };
  }

  openCircuit(c: Circuit): void { this.selectedCircuit = c; }
  openReservation(r: Reservation): void { this.selectedReservation = r; }

  goToBooking(t: { destination: string; type: string; id: string }): void {
    this.router.navigate(['/reservation'], { queryParams: { destination: t.destination, tourType: t.type, tourId: t.id } });
  }

  toggleSeat(seat: string): void {
    this._selectedSeats.update((seats) =>
      seats.includes(seat) ? seats.filter((s) => s !== seat) : seats.length < 4 ? [...seats, seat] : seats
    );
  }

  confirmCancel(): void { this.cancelTarget = this.selectedReservation; }

  doCancel(): void {
    if (!this.cancelTarget) return;
    const ref = this.cancelTarget.reference;
    this.reservations = this.reservations.map((r) =>
      r.reference === ref ? { ...r, status: 'Annulée' as const } : r
    );
    if (this.selectedReservation?.reference === ref) {
      this.selectedReservation = { ...this.selectedReservation, status: 'Annulée' };
    }
    this.cancelTarget = null;
  }

  openEditCircuit(c: Circuit): void { this.editingCircuit = { ...c, steps: [...c.steps] }; }

  createCircuit(): void {
    this.editingCircuit = {
      id: `nouveau-${Date.now()}`, name: 'Nouveau circuit', location: 'Tunisie',
      description: 'Description à compléter', duration: '0 h', distance: '0 km',
      image: circuits[0].image, linkedTrip: 'Aucun voyage associé', steps: [],
    };
  }

  deleteCircuit(id: string): void {
    if (window.confirm('Supprimer ce circuit de démonstration ?')) {
      this._adminCircuits.update((list) => list.filter((c) => c.id !== id));
    }
  }

  moveStep(index: number, direction: -1 | 1): void {
    if (!this.editingCircuit) return;
    const steps = [...this.editingCircuit.steps];
    [steps[index], steps[index + direction]] = [steps[index + direction], steps[index]];
    this.editingCircuit = { ...this.editingCircuit, steps };
  }

  removeStep(index: number): void {
    if (!this.editingCircuit) return;
    this.editingCircuit = { ...this.editingCircuit, steps: this.editingCircuit.steps.filter((_, i) => i !== index) };
  }

  addStep(): void {
    if (!this.editingCircuit) return;
    this.editingCircuit = {
      ...this.editingCircuit,
      steps: [...this.editingCircuit.steps, { name: 'Nouvelle étape', time: '10:00', duration: '1 h', distance: '0 km', description: 'À compléter' }],
    };
  }

  saveCircuit(): void {
    if (!this.editingCircuit) return;
    this._adminCircuits.update((list) =>
      list.some((c) => c.id === this.editingCircuit!.id)
        ? list.map((c) => (c.id === this.editingCircuit!.id ? this.editingCircuit! : c))
        : [...list, this.editingCircuit!]
    );
    this.editingCircuit = null;
  }

  showTicketAlert(): void {
    window.alert('Téléchargement simulé dans cette démonstration.');
  }
}
