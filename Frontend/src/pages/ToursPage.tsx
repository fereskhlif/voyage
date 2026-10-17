import { useMemo, useState } from "react";
import { TourCard } from "../components/Cards";
import { PageHeader } from "../components/SiteParts";
import { categoryLabels, destinations, tours } from "../data/tours";
import type { SharedPageProps } from "./types";

export default function ToursPage({ book }: SharedPageProps) {
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("all");
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState("recommended");

  const visible = useMemo(() => tours.filter((tour) =>
    (!destination || tour.destination === destination) &&
    (!type || tour.type === type) &&
    (price === "all" || tour.pricePerPerson <= Number(price)) &&
    (!availability || tour.availability > 0)
  ).sort((a, b) => sort === "low" ? a.pricePerPerson - b.pricePerPerson : sort === "high" ? b.pricePerPerson - a.pricePerPerson : sort === "rating" ? b.rating - a.rating : 0), [availability, destination, price, sort, type]);

  return (
    <>
      <PageHeader title="Circuits" current="Circuits" />
      <main className="listing-page">
        <div className="content-shell">
          <div className="listing-intro"><div><p>Expériences sélectionnées</p><h2>Choisissez le circuit qui vous ressemble</h2></div><label className="sort-field">Trier par<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommandés</option><option value="low">Prix croissant</option><option value="high">Prix décroissant</option><option value="rating">Mieux notés</option></select></label></div>
          <div className="filters-panel">
            <label>Destination<select value={destination} onChange={(event) => setDestination(event.target.value)}><option value="">Toutes</option>{destinations.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="">Tous</option>{Object.entries(categoryLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label>Budget maximal<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">Tous les prix</option><option value="1500">1 500 DT</option><option value="3000">3 000 DT</option><option value="5000">5 000 DT</option></select></label>
            <label className="check-filter"><input type="checkbox" checked={availability} onChange={(event) => setAvailability(event.target.checked)} />Places disponibles</label>
          </div>
          <p className="result-count">{visible.length} circuits trouvés</p>
          <div className="cards-grid">{visible.map((tour) => <TourCard tour={tour} key={tour.id} onBook={() => book({ destination: tour.destination, tourType: tour.type, selectedTour: tour })} />)}</div>
        </div>
      </main>
    </>
  );
}
