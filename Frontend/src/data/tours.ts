export type DestinationInfo = {
  name: string;
  country: string;
  description: string;
  category: "Beach" | "City Break" | "Adventure" | "Cultural" | "Wellness" | "Family";
  duration: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  image: string;
};

export type Tour = {
  id: string;
  destination: string;
  title: string;
  durationDays: number;
  type: DestinationInfo["category"];
  pricePerPerson: number;
  rating: number;
  image: string;
  included: string[];
  availability: number;
};

export const categoryLabels: Record<DestinationInfo["category"], string> = {
  Beach: "Plage",
  "City Break": "Escapade urbaine",
  Adventure: "Aventure",
  Cultural: "Culture",
  Wellness: "Bien-être",
  Family: "Famille",
};

export const destinations: DestinationInfo[] = [
  {
    name: "Santorin", country: "Grèce", category: "Beach", duration: "7 jours", priceFrom: 3690,
    rating: 4.9, reviews: 164, description: "Villages blancs et couchers de soleil dorés sur la mer Égée.",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Cappadoce", country: "Turquie", category: "Adventure", duration: "5 jours", priceFrom: 2490,
    rating: 4.8, reviews: 120, description: "Vols en montgolfière au-dessus des cheminées de fée au lever du soleil.",
    image: "https://images.unsplash.com/photo-1580514120049-74dd27aa9262?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Kyoto", country: "Japon", category: "Cultural", duration: "8 jours", priceFrom: 4690,
    rating: 4.9, reviews: 98, description: "Temples anciens, maisons de thé et jardins de cerisiers.",
    image: "https://images.unsplash.com/photo-1665706896821-319040b81753?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Bali", country: "Indonésie", category: "Wellness", duration: "6 jours", priceFrom: 2790,
    rating: 4.7, reviews: 203, description: "Rizières, plages de surf et retraites paisibles au cœur des tropiques.",
    image: "https://images.unsplash.com/photo-1761521688849-9700476692e5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Marrakech", country: "Maroc", category: "City Break", duration: "5 jours", priceFrom: 1990,
    rating: 4.8, reviews: 87, description: "Souks vibrants, riads et excursions vers les montagnes de l’Atlas.",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Alpes suisses", country: "Suisse", category: "Adventure", duration: "7 jours", priceFrom: 5590,
    rating: 4.9, reviews: 142, description: "Trains panoramiques, lacs paisibles et sommets enneigés.",
    image: "https://images.unsplash.com/photo-1517079810336-d39e72287591?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Tunis", country: "Tunisie", category: "City Break", duration: "4 jours", priceFrom: 890,
    rating: 4.7, reviews: 76, description: "Médina historique, musées et art de vivre méditerranéen.",
    image: "https://images.unsplash.com/photo-1607869861980-da5f9b8b4969?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Djerba", country: "Tunisie", category: "Beach", duration: "6 jours", priceFrom: 1290,
    rating: 4.8, reviews: 131, description: "Plages lumineuses, villages insulaires et hospitalité du Sud.",
    image: "https://images.unsplash.com/photo-1598554200951-b9f36526ecd9?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Carthage", country: "Tunisie", category: "Cultural", duration: "3 jours", priceFrom: 690,
    rating: 4.8, reviews: 64, description: "Vestiges antiques, ports puniques et patrimoine au bord de la mer.",
    image: "https://images.unsplash.com/photo-1755463083594-8cd2d1e2135e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Grand Tunis", country: "Tunisie", category: "Family", duration: "5 jours", priceFrom: 1090,
    rating: 4.7, reviews: 89, description: "De Tunis à Sidi Bou Saïd, un séjour familial entre culture et littoral.",
    image: "https://images.unsplash.com/photo-1653174638637-bffdc627376d?auto=format&fit=crop&w=1000&q=85",
  },
];

const variants = [
  { title: "Essentiel", priceFactor: 1, days: 0, ratingOffset: 0, availability: 12 },
  { title: "Signature", priceFactor: 1.25, days: 2, ratingOffset: 0.1, availability: 5 },
];

export const tours: Tour[] = destinations.flatMap((destination) =>
  variants.map((variant, index) => ({
    id: `${destination.name.toLowerCase().replace(/\s/g, "-")}-${index + 1}`,
    destination: destination.name,
    title: `${destination.name} ${variant.title}`,
    durationDays: Number.parseInt(destination.duration, 10) + variant.days,
    type: destination.category,
    pricePerPerson: Math.round((destination.priceFrom * variant.priceFactor) / 10) * 10,
    rating: Math.min(5, destination.rating + variant.ratingOffset),
    image: destination.image,
    included: ["Hôtel", "Petit-déjeuner", "Guide local", "Transfert"],
    availability: variant.availability,
  })),
);
