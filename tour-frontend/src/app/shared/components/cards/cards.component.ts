import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import { type Destination, type Tour, categoryLabels } from '../../../core/models/destination.model';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [],
  template: `
    <article class="destination-card-new">
      <div class="card-photo">
        <img [src]="destination.image" [alt]="destination.name + ', ' + destination.country" loading="lazy" />
        <span>{{ destination.duration }}</span>
        <button type="button" [attr.aria-label]="'Ajouter ' + destination.name + ' aux favoris'">♡</button>
      </div>
      <div class="card-copy">
        <small>⌖ {{ destination.name }}, {{ destination.country }}</small>
        <h3>{{ destination.name }}</h3>
        <p>{{ destination.description }}</p>
        <div>
          <strong>À partir de {{ destination.priceFrom.toLocaleString('fr-FR') }} DT</strong>
          <span>★ {{ destination.rating }} ({{ destination.reviews }})</span>
        </div>
        <button type="button" (click)="book.emit()">
          Réserver
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
        </button>
      </div>
    </article>
  `,
})
export class DestinationCardComponent {
  @Input({ required: true }) destination!: Destination;
  @Output() book = new EventEmitter<void>();
}

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [],
  template: `
    <article class="tour-card-new">
      <div class="card-photo">
        <img [src]="tour.image" [alt]="tour.title" loading="lazy" />
        <span>{{ tour.durationDays }} jours</span>
        <small>{{ tour.availability }} places</small>
      </div>
      <div class="card-copy">
        <div class="tour-kicker">
          <span>{{ categoryLabels[tour.type] }}</span>
          <b>★ {{ tour.rating.toFixed(1) }}</b>
        </div>
        <h3>{{ tour.title }}</h3>
        <p>{{ tour.included.join(' · ') }}</p>
        <div>
          <strong>{{ tour.pricePerPerson.toLocaleString('fr-FR') }} DT / personne</strong>
        </div>
        <button type="button" (click)="book.emit(tour)">
          Réserver
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
        </button>
      </div>
    </article>
  `,
})
export class TourCardComponent {
  @Input({ required: true }) tour!: Tour;
  @Output() book = new EventEmitter<Tour>();
  readonly categoryLabels = categoryLabels;
}
