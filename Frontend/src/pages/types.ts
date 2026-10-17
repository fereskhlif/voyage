import type { Tour } from "../data/tours";

export type PageName = "home" | "destinations" | "tours" | "booking" | "about" | "contact";

export type BookingPrefill = {
  destination: string;
  tourType: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  selectedTour?: Tour;
};

export type SharedPageProps = {
  navigate: (page: PageName) => void;
  book: (prefill?: Partial<BookingPrefill>) => void;
};
