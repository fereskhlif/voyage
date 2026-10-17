import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { DestinationCardComponent } from '../../../../shared/components/cards/cards.component';
import { PageHeaderComponent } from '../../../../shared/components/site-parts/site-parts.component';
import { destinations } from '../../../../shared/data/tours.mock';
import { type DestinationCategory } from '../../../../core/models/destination.model';

const filters: Array<{ key: string; label: string }> = [
  { key: 'Tous', label: 'Tous' },
  { key: 'Beach', label: 'Plage' },
  { key: 'City Break', label: 'Escapade urbaine' },
  { key: 'Adventure', label: 'Aventure' },
  { key: 'Cultural', label: 'Culture' },
  { key: 'Wellness', label: 'Bien-être' },
  { key: 'Family', label: 'Famille' },
];

@Component({
  selector: 'app-destinations-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DestinationCardComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Destinations" current="Destinations" />
    <main class="listing-page">
      <div class="content-shell">
        <div class="listing-intro">
          <div><p>Le monde vous attend</p><h2>Trouvez votre prochaine destination</h2></div>
          <label class="search-field">
            <span class="sr-only">Rechercher une destination</span>
            <input [(ngModel)]="query" placeholder="Rechercher une destination…" />
          </label>
        </div>

        <div class="filter-chips" aria-label="Filtrer les destinations">
          <button
            *ngFor="let f of filters"
            type="button"
            [class.active]="activeFilter() === f.key"
            [attr.aria-pressed]="activeFilter() === f.key"
            (click)="setFilter(f.key)"
          >{{ f.label }}</button>
        </div>

        <ng-container *ngIf="visible().length; else empty">
          <div class="cards-grid">
            <app-destination-card
              *ngFor="let d of visible()"
              [destination]="d"
              (book)="goToBooking(d.name, d.category)"
            />
          </div>
        </ng-container>
        <ng-template #empty>
          <div class="empty-state">
            <h3>Aucune destination trouvée</h3>
            <p>Essayez un autre mot-clé ou un autre filtre.</p>
          </div>
        </ng-template>
      </div>
    </main>
  `,
})
export class DestinationsPageComponent {
  readonly filters = filters;
  query = '';
  private _filter = signal('Tous');
  readonly activeFilter = this._filter.asReadonly();

  readonly visible = computed(() => {
    const q = this.query.toLowerCase();
    const f = this._filter();
    return destinations.filter(
      (d) => (f === 'Tous' || d.category === f) && `${d.name} ${d.country}`.toLowerCase().includes(q)
    );
  });

  constructor(private router: Router) {}

  setFilter(key: string): void { this._filter.set(key); }

  goToBooking(destination: string, category: DestinationCategory): void {
    this.router.navigate(['/reservation'], { queryParams: { destination, tourType: category } });
  }
}
