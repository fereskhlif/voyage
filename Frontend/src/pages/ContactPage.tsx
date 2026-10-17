import { useState } from "react";
import { ArrowIcon, PageHeader } from "../components/SiteParts";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHeader title="Contact" current="Contact" />
      <main className="contact-page">
        <div className="contact-layout">
          <div className="contact-info"><p>Parlons de votre voyage</p><h2>Notre équipe est à votre écoute</h2><span>Besoin d’un conseil ou d’un itinéraire personnalisé ? Écrivez-nous, nous vous répondrons dans les meilleurs délais.</span><div><article><small>Téléphone</small><strong>+216 71 000 000</strong></article><article><small>E-mail</small><strong>bonjour@tour.tn</strong></article><article><small>Adresse</small><strong>Les Berges du Lac, Tunis</strong></article></div></div>
          <form className="contact-form-new" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>Nom complet<input required placeholder="Votre nom" /></label><label>Adresse e-mail<input type="email" required placeholder="vous@exemple.com" /></label><label className="wide">Sujet<input required placeholder="Comment pouvons-nous vous aider ?" /></label><label className="wide">Message<textarea required placeholder="Parlez-nous de votre projet de voyage…" /></label><button type="submit">Envoyer le message <ArrowIcon /></button>{sent && <p role="status">Merci, votre message de démonstration a bien été envoyé.</p>}</form>
        </div>
      </main>
    </>
  );
}
