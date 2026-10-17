import { categoryLabels, type DestinationInfo, type Tour } from "../data/tours";
import { ArrowIcon } from "./SiteParts";

export function DestinationCard({ destination, onBook }: { destination: DestinationInfo; onBook: () => void }) {
  return (
    <article className="destination-card-new">
      <div className="card-photo">
        <img src={destination.image} alt={`${destination.name}, ${destination.country}`} />
        <span>{destination.duration}</span>
        <button type="button" aria-label={`Ajouter ${destination.name} aux favoris`}>♡</button>
      </div>
      <div className="card-copy">
        <small>⌖ {destination.name}, {destination.country}</small>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <div><strong>À partir de {destination.priceFrom.toLocaleString("fr-FR")} DT</strong><span>★ {destination.rating} ({destination.reviews})</span></div>
        <button type="button" onClick={onBook}>Réserver <ArrowIcon /></button>
      </div>
    </article>
  );
}

export function TourCard({ tour, onBook }: { tour: Tour; onBook: () => void }) {
  return (
    <article className="tour-card-new">
      <div className="card-photo">
        <img src={tour.image} alt={tour.title} />
        <span>{tour.durationDays} jours</span>
        <small>{tour.availability} places</small>
      </div>
      <div className="card-copy">
        <div className="tour-kicker"><span>{categoryLabels[tour.type]}</span><b>★ {tour.rating.toFixed(1)}</b></div>
        <h3>{tour.title}</h3>
        <p>{tour.included.join(" · ")}</p>
        <div><strong>{tour.pricePerPerson.toLocaleString("fr-FR")} DT / personne</strong></div>
        <button type="button" onClick={onBook}>Réserver <ArrowIcon /></button>
      </div>
    </article>
  );
}
