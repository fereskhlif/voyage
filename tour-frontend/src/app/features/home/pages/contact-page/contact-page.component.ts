import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/site-parts/site-parts.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Contact" current="Contact" />
    <main class="contact-page">
      <div class="contact-layout">
        <div class="contact-info">
          <p>Parlons de votre voyage</p>
          <h2>Notre équipe est à votre écoute</h2>
          <span>
            Besoin d'un conseil ou d'un itinéraire personnalisé ? Écrivez-nous,
            nous vous répondrons dans les meilleurs délais.
          </span>
          <div>
            <article>
              <small>Téléphone</small>
              <strong>+216 71 000 000</strong>
            </article>
            <article>
              <small>E-mail</small>
              <strong>bonjour&#64;tour.tn</strong>
            </article>
            <article>
              <small>Adresse</small>
              <strong>Les Berges du Lac, Tunis</strong>
            </article>
          </div>
        </div>

        <form class="contact-form-new" (ngSubmit)="onSubmit()">
          <label>
            Nom complet
            <input required [(ngModel)]="form.name" name="name" placeholder="Votre nom" />
          </label>
          <label>
            Adresse e-mail
            <input type="email" required [(ngModel)]="form.email" name="email" placeholder="vous@exemple.com" />
          </label>
          <label class="wide">
            Sujet
            <input required [(ngModel)]="form.subject" name="subject" placeholder="Comment pouvons-nous vous aider ?" />
          </label>
          <label class="wide">
            Message
            <textarea required [(ngModel)]="form.message" name="message" placeholder="Parlez-nous de votre projet de voyage…"></textarea>
          </label>
          <button type="submit">
            Envoyer le message
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4"/></svg>
          </button>
          <p *ngIf="sent()" role="status">Merci, votre message de démonstration a bien été envoyé.</p>
        </form>
      </div>
    </main>
  `,
})
export class ContactPageComponent {
  sent = signal(false);

  form = { name: '', email: '', subject: '', message: '' };

  onSubmit(): void {
    this.sent.set(true);
    // TODO: POST /api/contact via Gateway
  }
}
