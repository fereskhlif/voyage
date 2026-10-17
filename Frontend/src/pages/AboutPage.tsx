import { PageHeader, StatsBand } from "../components/SiteParts";
import type { SharedPageProps } from "./types";

const features = [
  ["◇", "Meilleur prix garanti", "Des offres transparentes et pensées pour chaque budget."],
  ["⌖", "Guides locaux experts", "Des passionnés qui connaissent chaque destination."],
  ["◷", "Assistance 24 h/24", "Une équipe disponible avant, pendant et après le voyage."],
  ["✓", "Réservation flexible", "Des conditions claires pour voyager sereinement."],
];

export default function AboutPage({ book }: SharedPageProps) {
  return (
    <>
      <PageHeader title="À propos" current="À propos" />
      <main className="about-page">
        <div className="about-layout">
          <div className="about-photos"><img src="https://images.unsplash.com/photo-1769365684859-363edb643bbf?auto=format&fit=crop&w=1200&q=85" alt="Groupe de voyageurs" /><img src="https://images.unsplash.com/flagged/photo-1573998594056-53123f2fedec?auto=format&fit=crop&w=600&q=85" alt="Voyageurs heureux" /><span><strong>15+</strong>Années d’expérience</span></div>
          <div className="about-text"><p>À propos de nous</p><h2>Nous créons des expériences de voyage inoubliables</h2><span>Depuis plus de quinze ans, nous transformons les envies d’évasion en voyages soigneusement organisés. Nos experts vous rapprochent de lieux authentiques, de rencontres marquantes et de souvenirs durables.</span><div className="feature-grid">{features.map(([icon, title, text]) => <article key={title}><i>{icon}</i><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><button type="button" onClick={() => book()}>Planifier mon voyage</button></div>
        </div>
      </main>
      <StatsBand />
    </>
  );
}
