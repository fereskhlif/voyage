import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="site-app">
      <!-- Navigation -->
      <header class="global-nav" [class.solid]="scrolled()">
        <nav class="nav-pill" aria-label="Navigation principale">
          <a routerLink="/" class="brand-button" aria-label="Tour — Accueil">TOUR</a>

          <div class="desktop-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
            <a routerLink="/destinations" routerLinkActive="active">Destinations</a>
            <a routerLink="/circuits" routerLinkActive="active">Circuits</a>
            <a routerLink="/mes-reservations" routerLinkActive="active">Mes réservations</a>
            <a routerLink="/a-propos" routerLinkActive="active">À propos</a>
            <a routerLink="/contact" routerLinkActive="active">Contact</a>
          </div>

          <a routerLink="/reservation" class="book-nav">Réserver</a>

          <button
            id="nav-hamburger"
            class="hamburger"
            [class.open]="menuOpen()"
            type="button"
            [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-navigation"
            (click)="toggleMenu()"
          ><i></i><i></i><i></i></button>

          <div id="mobile-navigation" class="mobile-panel" [class.open]="menuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Accueil</a>
            <a routerLink="/destinations" routerLinkActive="active" (click)="closeMenu()">Destinations</a>
            <a routerLink="/circuits" routerLinkActive="active" (click)="closeMenu()">Circuits</a>
            <a routerLink="/mes-reservations" routerLinkActive="active" (click)="closeMenu()">Mes réservations</a>
            <a routerLink="/a-propos" routerLinkActive="active" (click)="closeMenu()">À propos</a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
            <a routerLink="/reservation" class="book-nav mobile-book" (click)="closeMenu()">Réserver maintenant</a>
          </div>
        </nav>
      </header>

      <!-- Page content -->
      <div class="page-transition">
        <router-outlet />
      </div>

      <!-- Footer -->
      <footer class="global-footer">
        <div class="footer-main">
          <div>
            <a routerLink="/" class="brand-button" style="display:inline-block">TOUR</a>
            <p>Des voyages mémorables, pensés avec attention.</p>
          </div>
          <nav aria-label="Navigation de pied de page">
            <a routerLink="/">Accueil</a>
            <a routerLink="/destinations">Destinations</a>
            <a routerLink="/circuits">Circuits</a>
            <a routerLink="/a-propos">À propos</a>
            <a routerLink="/contact">Contact</a>
          </nav>
          <a routerLink="/reservation" class="footer-book">Planifier mon voyage</a>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Tour. Tous droits réservés.</span>
          <span>Prix et disponibilités de démonstration.</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .brand-button { text-decoration: none; }
    .footer-main .brand-button { font-family: 'Raleway', sans-serif; font-size: 23px; font-weight: 800; letter-spacing: .18em; color: #fff; background: none; border: 0; cursor: pointer; }
  `],
})
export class MainLayoutComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(): void { this.menuOpen.update((v) => !v); }
  closeMenu(): void { this.menuOpen.set(false); }
}
