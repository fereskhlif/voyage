import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { DestinationCardComponent, TourCardComponent } from '../../../../shared/components/cards/cards.component';
import { SectionHeadingComponent, StatsBandComponent } from '../../../../shared/components/site-parts/site-parts.component';
import { destinations, tours } from '../../../../shared/data/tours.mock';
import { type Tour } from '../../../../core/models/destination.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, NgFor, DestinationCardComponent, TourCardComponent, SectionHeadingComponent, StatsBandComponent],
  template: `
    <!-- Hero -->
    <section class="home-hero">
      <div class="hero-overlay"></div>
      <div class="hero-layout">
        <div class="hero-message">
          <p><i></i>Explorez le monde avec nous</p>
          <h1>Découvrez votre voyage idéal</h1>
          <span>Des aventures inoubliables, des destinations d'exception et des souvenirs qui durent toute une vie.</span>
          <div>
            <button type="button" (click)="goToBooking()">
              Commencer l'exploration
              <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
            </button>
            <button type="button" (click)="router.navigate(['/circuits'])">Parcourir les circuits</button>
          </div>
        </div>

        <!-- Quick booking card -->
        <form class="hero-booking-card" (ngSubmit)="onSearch()">
          <h2>Planifiez votre aventure</h2>
          <label>
            Destination
            <select [(ngModel)]="destination" name="destination" required>
              <option value="">Choisissez votre destination</option>
              <option *ngFor="let d of allDestinations" [value]="d.name">{{ d.name }}</option>
            </select>
          </label>
          <div class="form-columns">
            <label>Date de départ<input type="date" [(ngModel)]="departure" name="departure" required /></label>
            <label>Date de retour<input type="date" [(ngModel)]="returnDate" name="returnDate" required /></label>
          </div>
          <label>
            Voyageurs
            <select [(ngModel)]="travelers" name="travelers">
              <option *ngFor="let n of travelerOptions" [value]="n">{{ n }} voyageur{{ n > 1 ? 's' : '' }}</option>
            </select>
          </label>
          <button type="submit">
            Trouver mon voyage
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
          </button>
        </form>
      </div>
    </section>

    <!-- Destinations phares -->
    <section class="content-section">
      <div class="content-shell">
        <app-section-heading eyebrow="Destinations phares" title="Évadez-vous vers l'exception">
          Découvrez nos lieux les plus appréciés, sélectionnés pour leur beauté et leur authenticité.
        </app-section-heading>
        <div class="cards-grid">
          <app-destination-card
            *ngFor="let d of featuredDestinations"
            [destination]="d"
            (book)="goToBooking(d.name, d.category)"
          />
        </div>
        <button class="outline-action" type="button" (click)="router.navigate(['/destinations'])">
          Voir toutes les destinations
        </button>
      </div>
    </section>

    <!-- Circuits recommandés -->
    <section class="content-section muted-section">
      <div class="content-shell">
        <app-section-heading eyebrow="Circuits recommandés" title="Voyagez à votre rythme">
          Des séjours complets, pensés pour vous faire profiter de chaque instant.
        </app-section-heading>
        <div class="cards-grid">
          <app-tour-card
            *ngFor="let t of featuredTours"
            [tour]="t"
            (book)="onTourBook($event)"
          />
        </div>
        <button class="outline-action" type="button" (click)="router.navigate(['/circuits'])">
          Parcourir les circuits
        </button>
      </div>
    </section>

    <!-- À propos aperçu -->
    <section class="home-about">
      <div class="home-about-image">
        <img
          src="https://images.unsplash.com/photo-1769365684859-363edb643bbf?auto=format&fit=crop&w=1200&q=85"
          alt="Voyageurs admirant un panorama" loading="lazy"
        />
        <span><strong>15+</strong> années d'expérience</span>
      </div>
      <div>
        <p>À propos de Tour</p>
        <h2>Nous créons des expériences de voyage inoubliables</h2>
        <span>Notre équipe imagine des itinéraires authentiques, soutenus par des experts locaux et un accompagnement attentif à chaque étape.</span>
        <button type="button" (click)="router.navigate(['/a-propos'])">
          En savoir plus
          <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
        </button>
      </div>
    </section>

    <app-stats-band [showAction]="true" (action)="goToBooking()" />
  `,
})
export class HomePageComponent {
  readonly allDestinations = destinations;
  readonly featuredDestinations = destinations.slice(0, 3);
  readonly featuredTours = tours.slice(0, 3);
  readonly travelerOptions = [1, 2, 3, 4, 5, 6];

  destination = '';
  departure = '';
  returnDate = '';
  travelers = 2;

  constructor(readonly router: Router) {}

  onSearch(): void {
    this.router.navigate(['/reservation'], {
      queryParams: { destination: this.destination, departure: this.departure, returnDate: this.returnDate, adults: this.travelers },
    });
  }

  goToBooking(destination = '', tourType = ''): void {
    this.router.navigate(['/reservation'], { queryParams: { destination, tourType } });
  }

  onTourBook(tour: Tour): void {
    this.router.navigate(['/reservation'], {
      queryParams: { destination: tour.destination, tourType: tour.type, tourId: tour.id },
    });
  }
}
