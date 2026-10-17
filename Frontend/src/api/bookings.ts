import type { Tour } from "../data/tours";

export type BookingRequest = {
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  tourType: string;
  selectedTour: Tour | null;
  customer: {
    fullName: string;
    email: string;
    phoneCode: string;
    phone: string;
    specialRequests: string;
    travelerNames: string[];
  };
  reference: string;
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

export async function searchAvailableTours() {
  await wait(1000);
  return { available: true };
}

export async function createBooking(_booking: BookingRequest) {
  await wait(900);
  return {
    reference: `TOUR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "confirmed" as const,
  };
}
