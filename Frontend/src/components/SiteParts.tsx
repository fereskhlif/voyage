import type { ReactNode } from "react";
import type { PageName } from "../pages/types";

export function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

export function PageHeader({ title, current }: { title: string; current: string }) {
  return (
    <header className="page-band">
      <div><h1>{title}</h1><p>Accueil <span>/</span> {current}</p></div>
    </header>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <header className="section-title"><p>{eyebrow}</p><h2>{title}</h2><span>{children}</span></header>;
}

export function StatsBand({ onAction }: { onAction?: () => void }) {
  return (
    <section className="stats-band">
      <div className="stats-grid">
        <div><strong>15+</strong><span>Années d’expérience</span></div>
        <div><strong>42</strong><span>Destinations</span></div>
        <div><strong>12 000+</strong><span>Voyageurs heureux</span></div>
        <div><strong>4,9/5</strong><span>Note moyenne</span></div>
        {onAction && <button type="button" onClick={onAction}>Planifier mon voyage <ArrowIcon /></button>}
      </div>
    </section>
  );
}

export const pageLabels: Record<PageName, string> = {
  home: "Accueil",
  destinations: "Destinations",
  tours: "Circuits",
  booking: "Réservation",
  about: "À propos",
  contact: "Contact",
};
