import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/site-parts/site-parts.component';
import { ReservationService } from '../../../../core/services/reservation.service';
import { destinations, tours } from '../../../../shared/data/tours.mock';
import { categoryLabels, type Tour } from '../../../../core/models/destination.model';
import { type BookingRequest } from '../../../../core/models/reservation.model';

type Stage = 'traveler' | 'review' | 'confirmation';

interface CustomerForm {
  fullName: string;
  email: string;
  phoneCode: string;
  phone: string;
  specialRequests: string;
  travelerNames: string[];
}

const today = new Date().toISOString().split('T')[0];

const formatDate = (value: string): string =>
  value
    ? new Intl.DateTimeFormat('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(`${value}T12:00:00`)
      )
    : 'Date à définir';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, PageHeaderComponent],
  template: `
    <app-page-header title="Réservation" current="Réservation" />
    <main class="booking-page">

      <!-- ── Search form ── -->
      <section class="booking-search-layout">
        <div>
          <p>Votre prochain départ</p>
          <h2>Planifiez votre aventure</h2>
          <span>Choisissez vos critères pour afficher les circuits disponibles. Toutes les données présentées sont fictives.</span>
        </div>
        <form class="booking-form-page" (ngSubmit)="search()">
          <label>
            Destination
            <select [(ngModel)]="bookingDestination" name="destination" required (ngModelChange)="clearTour()">
              <option value="">Choisissez votre destination</option>
              <option *ngFor="let d of allDestinations" [value]="d.name">{{ d.name }}</option>
            </select>
          </label>
          <div class="form-columns">
            <label>Date de départ<input type="date" [(ngModel)]="departureDate" name="departure" [min]="today" required /></label>
            <label>Date de retour<input type="date" [(ngModel)]="returnDate" name="returnDate" [min]="departureDate || today" required /></label>
          </div>
          <div class="form-columns">
            <label>
              Adultes
              <select [(ngModel)]="adults" name="adults">
                <option *ngFor="let n of adultsRange" [value]="n">{{ n }}</option>
              </select>
            </label>
            <label>
              Enfants
              <select [(ngModel)]="children" name="children">
                <option *ngFor="let n of childrenRange" [value]="n">{{ n }}</option>
              </select>
            </label>
          </div>
          <label>
            Type de circuit
            <select [(ngModel)]="tourType" name="tourType">
              <option value="">Tous les types</option>
              <option *ngFor="let entry of categoryEntries" [value]="entry[0]">{{ entry[1] }}</option>
            </select>
          </label>
          <button type="submit" [disabled]="loading">
            <i *ngIf="loading && !selectedTour" class="spinner"></i>
            <svg *ngIf="!loading || !!selectedTour" aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
            Rechercher un voyage
          </button>
        </form>
      </section>

      <!-- ── Results ── -->
      <section *ngIf="searched && !selectedTour" id="available-tours" class="available-tours">
        <h2>Circuits disponibles</h2>
        <div *ngIf="matchingTours.length; else noResult">
          <article *ngFor="let t of matchingTours">
            <img [src]="t.image" alt="" loading="lazy" />
            <div>
              <small>{{ categoryLabels[t.type] }} · {{ t.durationDays }} jours</small>
              <h3>{{ t.title }}</h3>
              <p>{{ t.included.join(' · ') }}</p>
              <span>★ {{ t.rating.toFixed(1) }} · {{ t.availability }} places restantes</span>
            </div>
            <aside>
              <strong>{{ t.pricePerPerson.toLocaleString('fr-FR') }} DT</strong>
              <small>par personne</small>
              <button type="button" (click)="selectTour(t)">Choisir ce circuit</button>
            </aside>
          </article>
        </div>
        <ng-template #noResult>
          <div class="empty-state"><h3>Aucun voyage trouvé</h3><p>Essayez d'autres dates ou retirez le filtre de type.</p></div>
        </ng-template>
      </section>

      <!-- ── Booking flow ── -->
      <section *ngIf="selectedTour" id="booking-flow" class="booking-flow-page">
        <div class="progress-steps">
          <div *ngFor="let step of steps; let i = index" [class.active]="stageIndex() >= i">
            <b>{{ i + 1 }}</b><span>{{ step }}</span>
          </div>
        </div>

        <!-- Step 1: Voyageurs -->
        <div *ngIf="stage === 'traveler'" class="flow-panel">
          <p>Étape 1 sur 3</p>
          <h2>Informations des voyageurs</h2>
          <div class="selected-tour-mini">
            <img [src]="selectedTour.image" alt="" loading="lazy" />
            <div>
              <small>{{ categoryLabels[selectedTour.type] }}</small>
              <strong>{{ selectedTour.title }}</strong>
              <span>{{ selectedTour.pricePerPerson.toLocaleString('fr-FR') }} DT / personne</span>
            </div>
          </div>
          <p *ngIf="errors['dates']" class="flow-error" role="alert">{{ errors['dates'] }}</p>
          <div class="traveler-form-grid">
            <label>Nom du contact<input [(ngModel)]="customer.fullName" /><small *ngIf="errors['name']">{{ errors['name'] }}</small></label>
            <label>Adresse e-mail<input type="email" [(ngModel)]="customer.email" /><small *ngIf="errors['email']">{{ errors['email'] }}</small></label>
            <label>Indicatif et téléphone
              <div class="phone-combo">
                <select [(ngModel)]="customer.phoneCode"><option>+216</option><option>+33</option><option>+1</option></select>
                <input [(ngModel)]="customer.phone" />
              </div>
              <small *ngIf="errors['phone']">{{ errors['phone'] }}</small>
            </label>
            <label>Demandes particulières<textarea [(ngModel)]="customer.specialRequests"></textarea></label>
          </div>
          <div class="traveler-names-page">
            <h3>Noms des voyageurs</h3>
            <label *ngFor="let slot of travelerSlots; let i = index">
              Voyageur {{ i + 1 }} {{ i < adults ? '(adulte)' : '(enfant)' }}
              <input [(ngModel)]="customer.travelerNames[i]" />
              <small *ngIf="errors['traveler-' + i]">{{ errors['traveler-' + i] }}</small>
            </label>
          </div>
          <button class="primary-wide" type="button" (click)="validateTraveler()">
            Continuer vers le récapitulatif
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
          </button>
        </div>

        <!-- Step 2: Review -->
        <div *ngIf="stage === 'review'" class="flow-panel">
          <p>Étape 2 sur 3</p>
          <h2>Récapitulatif de votre réservation</h2>
          <div class="review-summary">
            <div>
              <h3>{{ selectedTour.title }}</h3>
              <span>{{ formatDate(departureDate) }} → {{ formatDate(returnDate) }}</span>
              <span>{{ totalTravelers }} voyageur{{ totalTravelers > 1 ? 's' : '' }}</span>
            </div>
            <div class="price-lines">
              <p><span>Adultes ({{ adults }})</span><strong>{{ adultPrice.toLocaleString('fr-FR') }} DT</strong></p>
              <p><span>Enfants ({{ children }})</span><strong>{{ childPrice.toLocaleString('fr-FR') }} DT</strong></p>
              <p><span>Taxes et frais (10 %)</span><strong>{{ taxes.toLocaleString('fr-FR') }} DT</strong></p>
              <p><span>Total</span><strong>{{ total.toLocaleString('fr-FR') }} DT</strong></p>
            </div>
          </div>
          <label class="terms-line">
            <input type="checkbox" [(ngModel)]="termsAccepted" />
            J'accepte les conditions et la politique d'annulation.
          </label>
          <div class="flow-actions">
            <button type="button" (click)="stage = 'traveler'; stageIndex.set(0)">Retour</button>
            <button type="button" [disabled]="!termsAccepted || loading" (click)="confirm()">
              <i *ngIf="loading" class="spinner"></i>
              Confirmer la réservation
            </button>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div *ngIf="stage === 'confirmation'" class="flow-panel confirmation-panel">
          <i>✓</i>
          <h2>Réservation confirmée !</h2>
          <p>Votre voyage est réservé. Un récapitulatif a été envoyé à {{ customer.email }}.</p>
          <div>
            <small>Référence de réservation</small>
            <strong>{{ bookingReference }}</strong>
          </div>
          <h3>{{ selectedTour.title }}</h3>
          <span>Total : {{ total.toLocaleString('fr-FR') }} DT</span>
          <button type="button" (click)="router.navigate(['/'])">Retour à l'accueil</button>
        </div>
      </section>
    </main>
  `,
})
export class BookingPageComponent implements OnInit {
  readonly allDestinations = destinations;
  readonly categoryEntries = Object.entries(categoryLabels);
  readonly categoryLabels = categoryLabels;
  readonly adultsRange = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly childrenRange = Array.from({ length: 7 }, (_, i) => i);
  readonly steps = ['Voyageurs', 'Récapitulatif', 'Confirmation'];
  readonly today = today;
  readonly formatDate = formatDate;

  bookingDestination = '';
  departureDate = '';
  returnDate = '';
  adults = 1;
  children = 0;
  tourType = '';
  selectedTour: Tour | null = null;
  searched = false;
  loading = false;
  stage: Stage = 'traveler';
  termsAccepted = false;
  bookingReference = '';
  errors: Record<string, string> = {};

  customer: CustomerForm = {
    fullName: '', email: '', phoneCode: '+216', phone: '', specialRequests: '', travelerNames: [],
  };

  stageIndex = signal(0);

  get totalTravelers(): number { return this.adults + this.children; }
  get travelerSlots(): undefined[] { return Array.from({ length: this.totalTravelers }); }
  get adultPrice(): number { return this.selectedTour ? this.selectedTour.pricePerPerson * this.adults : 0; }
  get childPrice(): number { return this.selectedTour ? this.selectedTour.pricePerPerson * 0.5 * this.children : 0; }
  get taxes(): number { return (this.adultPrice + this.childPrice) * 0.1; }
  get total(): number { return this.adultPrice + this.childPrice + this.taxes; }

  get matchingTours(): Tour[] {
    return tours.filter(
      (t) => t.destination === this.bookingDestination && (!this.tourType || t.type === this.tourType)
    );
  }

  constructor(private reservationService: ReservationService, readonly router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.bookingDestination = params['destination'] || '';
      this.tourType = params['tourType'] || '';
      this.adults = Number(params['adults']) || 1;
      if (params['tourId']) {
        const t = tours.find((t) => t.id === params['tourId']);
        if (t) this.selectTour(t);
      }
    });
  }

  async search(): Promise<void> {
    if (!this.bookingDestination || !this.departureDate || !this.returnDate || this.returnDate <= this.departureDate) return;
    this.loading = true;
    await this.reservationService.searchAvailableTours().toPromise();
    this.searched = true;
    this.loading = false;
    setTimeout(() => document.querySelector('#available-tours')?.scrollIntoView({ behavior: 'smooth' }), 30);
  }

  selectTour(tour: Tour): void {
    this.selectedTour = tour;
    this.stage = 'traveler';
    this.stageIndex.set(0);
    this.customer.travelerNames = Array.from({ length: this.totalTravelers }, () => '');
    setTimeout(() => document.querySelector('#booking-flow')?.scrollIntoView({ behavior: 'smooth' }), 30);
  }

  clearTour(): void { this.selectedTour = null; this.searched = false; }

  validateTraveler(): void {
    const errs: Record<string, string> = {};
    if (!this.departureDate || !this.returnDate || this.returnDate <= this.departureDate) {
      errs['dates'] = 'Renseignez des dates de voyage valides dans le formulaire ci-dessus.';
    }
    if (!this.customer.fullName.trim()) errs['name'] = 'Le nom complet est requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customer.email)) errs['email'] = 'Saisissez une adresse e-mail valide.';
    if (!/^[0-9\s-]{6,15}$/.test(this.customer.phone)) errs['phone'] = 'Saisissez un numéro valide.';
    this.customer.travelerNames.forEach((n, i) => { if (!n.trim()) errs[`traveler-${i}`] = 'Le nom du voyageur est requis.'; });
    this.errors = errs;
    if (!Object.keys(errs).length) { this.stage = 'review'; this.stageIndex.set(1); }
  }

  async confirm(): Promise<void> {
    if (!this.termsAccepted) return;
    this.loading = true;
    const req: BookingRequest = {
      destination: this.bookingDestination,
      departureDate: this.departureDate,
      returnDate: this.returnDate,
      adults: this.adults,
      children: this.children,
      tourType: this.tourType,
      selectedTourId: this.selectedTour?.id ?? null,
      customer: { ...this.customer },
    };
    const res = await this.reservationService.create(req).toPromise();
    this.bookingReference = res!.reference;
    this.loading = false;
    this.stage = 'confirmation';
    this.stageIndex.set(2);
  }
}
