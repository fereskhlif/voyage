import { useMemo, useState } from "react";
import { DestinationCard } from "../components/Cards";
import { PageHeader } from "../components/SiteParts";
import { destinations } from "../data/tours";
import type { SharedPageProps } from "./types";

const filters = ["Tous", "Beach", "City Break", "Adventure", "Cultural", "Wellness", "Family"];

export default function DestinationsPage({ book }: SharedPageProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tous");
  const visible = useMemo(() => destinations.filter((item) =>
    (filter === "Tous" || item.category === filter) &&
    `${item.name} ${item.country}`.toLowerCase().includes(query.toLowerCase())
  ), [filter, query]);

  return (
    <>
      <PageHeader title="Destinations" current="Destinations" />
      <main className="listing-page">
        <div className="content-shell">
          <div className="listing-intro"><div><p>Le monde vous attend</p><h2>Trouvez votre prochaine destination</h2></div><label className="search-field"><span className="sr-only">Rechercher une destination</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une destination…" /></label></div>
          <div className="filter-chips" aria-label="Filtrer les destinations">{filters.map((item) => <button type="button" className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item === "Beach" ? "Plage" : item === "City Break" ? "Escapade urbaine" : item === "Cultural" ? "Culture" : item === "Wellness" ? "Bien-être" : item === "Family" ? "Famille" : item === "Adventure" ? "Aventure" : item}</button>)}</div>
          {visible.length ? <div className="cards-grid">{visible.map((item) => <DestinationCard destination={item} key={item.name} onBook={() => book({ destination: item.name, tourType: item.category })} />)}</div> : <div className="empty-state"><h3>Aucune destination trouvée</h3><p>Essayez un autre mot-clé ou un autre filtre.</p></div>}
        </div>
      </main>
    </>
  );
}
