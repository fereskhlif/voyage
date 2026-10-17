import { useState } from "react";
import { DestinationCard, TourCard } from "../components/Cards";
import { ArrowIcon, SectionHeading, StatsBand } from "../components/SiteParts";
import { destinations, tours } from "../data/tours";
import type { SharedPageProps } from "./types";

export default function HomePage({ navigate, book }: SharedPageProps) {
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("2");

  return (
    <>
      <section className="home-hero">
        <div className="hero-overlay" />
        <div className="hero-layout">
          <div className="hero-message">
            <p><i />Explorez le monde avec nous</p>
            <h1>Découvrez votre voyage idéal</h1>
            <span>Des aventures inoubliables, des destinations d’exception et des souvenirs qui durent toute une vie.</span>
            <div>
              <button type="button" onClick={() => book()}>Commencer l’exploration <ArrowIcon /></button>
              <button type="button" onClick={() => navigate("tours")}>Parcourir les circuits</button>
            </div>
          </div>
          <form className="hero-booking-card" onSubmit={(event) => { event.preventDefault(); book({ destination, departureDate: departure, returnDate, adults: Number(travelers) }); }}>
            <h2>Planifiez votre aventure</h2>
            <label>Destination<select value={destination} onChange={(event) => setDestination(event.target.value)} required><option value="">Choisissez votre destination</option>{destinations.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <div className="form-columns">
              <label>Date de départ<input type="date" value={departure} onChange={(event) => setDeparture(event.target.value)} required /></label>
              <label>Date de retour<input type="date" value={returnDate} onChange={(event) => setReturnDate(event.target.value)} required /></label>
            </div>
            <label>Voyageurs<select value={travelers} onChange={(event) => setTravelers(event.target.value)}>{[1, 2, 3, 4, 5, 6].map((count) => <option value={count} key={count}>{count} voyageur{count > 1 ? "s" : ""}</option>)}</select></label>
            <button type="submit">Trouver mon voyage <ArrowIcon /></button>
          </form>
        </div>
      </section>

      <section className="content-section">
        <div className="content-shell">
          <SectionHeading eyebrow="Destinations phares" title="Évadez-vous vers l’exception">Découvrez nos lieux les plus appréciés, sélectionnés pour leur beauté et leur authenticité.</SectionHeading>
          <div className="cards-grid">{destinations.slice(0, 3).map((item) => <DestinationCard destination={item} key={item.name} onBook={() => book({ destination: item.name, tourType: item.category })} />)}</div>
          <button className="outline-action" type="button" onClick={() => navigate("destinations")}>Voir toutes les destinations</button>
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="content-shell">
          <SectionHeading eyebrow="Circuits recommandés" title="Voyagez à votre rythme">Des séjours complets, pensés pour vous faire profiter de chaque instant.</SectionHeading>
          <div className="cards-grid">{tours.slice(0, 3).map((tour) => <TourCard tour={tour} key={tour.id} onBook={() => book({ destination: tour.destination, tourType: tour.type, selectedTour: tour })} />)}</div>
          <button className="outline-action" type="button" onClick={() => navigate("tours")}>Parcourir les circuits</button>
        </div>
      </section>

      <section className="home-about">
        <div className="home-about-image"><img src="https://images.unsplash.com/photo-1769365684859-363edb643bbf?auto=format&fit=crop&w=1200&q=85" alt="Voyageurs admirant un panorama" /><span><strong>15+</strong> années d’expérience</span></div>
        <div><p>À propos de Tour</p><h2>Nous créons des expériences de voyage inoubliables</h2><span>Notre équipe imagine des itinéraires authentiques, soutenus par des experts locaux et un accompagnement attentif à chaque étape.</span><button type="button" onClick={() => navigate("about")}>En savoir plus <ArrowIcon /></button></div>
      </section>
      <StatsBand onAction={() => book()} />
    </>
  );
}
