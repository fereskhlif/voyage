import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { TourCardComponent } from '../../../../shared/components/cards/cards.component';
import { PageHeaderComponent } from '../../../../shared/components/site-parts/site-parts.component';
import { destinations, tours } from '../../../../shared/data/tours.mock';
import { categoryLabels, type Tour } from '../../../../core/models/destination.model';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  imports: [FormsModule, NgFor, TourCardComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Circuits" current="Circuits" />
    <main class="listing-page">
      <div class="content-shell">
        <div class="listing-intro">
          <div><p>Expériences sélectionnées</p><h2>Choisissez le circuit qui vous ressemble</h2></div>
          <label class="sort-field">
            Trier par
            <select [(ngModel)]="sort">
              <option value="recommended">Recommandés</option>
              <option value="low">Prix croissant</option>
              <option value="high">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </label>
        </div>

        <div class="filters-panel">
          <label>
            Destination
            <select [(ngModel)]="destination">
              <option value="">Toutes</option>
              <option *ngFor="let d of allDestinations" [value]="d.name">{{ d.name }}</option>
            </select>
          </label>
          <label>
            Type
            <select [(ngModel)]="type">
              <option value="">Tous</option>
              <option *ngFor="let entry of categoryEntries" [value]="entry[0]">{{ entry[1] }}</option>
            </select>
          </label>
          <label>
            Budget maximal
            <select [(ngModel)]="maxPrice">
              <option value="all">Tous les prix</option>
              <option value="1500">1 500 DT</option>
              <option value="3000">3 000 DT</option>
              <option value="5000">5 000 DT</option>
            </select>
          </label>
          <label class="check-filter">
            <input type="checkbox" [(ngModel)]="onlyAvailable" />
            Places disponibles
          </label>
        </div>

        <p class="result-count">{{ visible().length }} circuits trouvés</p>

        <div class="cards-grid">
          <app-tour-card
            *ngFor="let t of visible()"
            [tour]="t"
            (book)="onBook($event)"
          />
        </div>
      </div>
    </main>
  `,
})
export class ToursPageComponent {
  readonly allDestinations = destinations;
  readonly categoryEntries = Object.entries(categoryLabels);

  destination = '';
  type = '';
  maxPrice = 'all';
  onlyAvailable = false;
  sort = 'recommended';

  readonly visible = computed(() => {
    const max = this.maxPrice === 'all' ? Infinity : Number(this.maxPrice);
    return tours
      .filter(
        (t) =>
          (!this.destination || t.destination === this.destination) &&
          (!this.type || t.type === this.type) &&
          t.pricePerPerson <= max &&
          (!this.onlyAvailable || t.availability > 0)
      )
      .sort((a, b) =>
        this.sort === 'low' ? a.pricePerPerson - b.pricePerPerson
        : this.sort === 'high' ? b.pricePerPerson - a.pricePerPerson
        : this.sort === 'rating' ? b.rating - a.rating
        : 0
      );
  });

  constructor(private router: Router) {}

  onBook(tour: Tour): void {
    this.router.navigate(['/reservation'], {
      queryParams: { destination: tour.destination, tourType: tour.type, tourId: tour.id },
    });
  }
}
