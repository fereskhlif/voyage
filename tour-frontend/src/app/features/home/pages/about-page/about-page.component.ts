import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { PageHeaderComponent, StatsBandComponent } from '../../../../shared/components/site-parts/site-parts.component';

const features = [
  ['◇', 'Meilleur prix garanti', 'Des offres transparentes et pensées pour chaque budget.'],
  ['⌖', 'Guides locaux experts', 'Des passionnés qui connaissent chaque destination.'],
  ['◷', 'Assistance 24 h/24', 'Une équipe disponible avant, pendant et après le voyage.'],
  ['✓', 'Réservation flexible', 'Des conditions claires pour voyager sereinement.'],
];

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NgFor, PageHeaderComponent, StatsBandComponent],
  template: `
    <app-page-header title="À propos" current="À propos" />
    <main class="about-page">
      <div class="about-layout">
        <div class="about-photos">
          <img
            src="https://images.unsplash.com/photo-1769365684859-363edb643bbf?auto=format&fit=crop&w=1200&q=85"
            alt="Groupe de voyageurs" loading="lazy"
          />
          <img
            src="https://images.unsplash.com/flagged/photo-1573998594056-53123f2fedec?auto=format&fit=crop&w=600&q=85"
            alt="Voyageurs heureux" loading="lazy"
          />
          <span><strong>15+</strong>Années d'expérience</span>
        </div>
        <div class="about-text">
          <p>À propos de nous</p>
          <h2>Nous créons des expériences de voyage inoubliables</h2>
          <span>
            Depuis plus de quinze ans, nous transformons les envies d'évasion en voyages soigneusement organisés.
            Nos experts vous rapprochent de lieux authentiques, de rencontres marquantes et de souvenirs durables.
          </span>
          <div class="feature-grid">
            <article *ngFor="let f of features">
              <i>{{ f[0] }}</i>
              <div><h3>{{ f[1] }}</h3><p>{{ f[2] }}</p></div>
            </article>
          </div>
          <button type="button" (click)="router.navigate(['/reservation'])">Planifier mon voyage</button>
        </div>
      </div>
    </main>
    <app-stats-band />
  `,
})
export class AboutPageComponent {
  readonly features = features;
  constructor(readonly router: Router) {}
}
