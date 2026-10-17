export type ReservationStatus = 'En attente' | 'Confirmée' | 'Annulée';

export interface Reservation {
  reference: string;
  destination: string;
  dates: string;
  travelers: number;
  amount: number;
  status: ReservationStatus;
  names: string[];
}

export interface BookingRequest {
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  tourType: string;
  selectedTourId: string | null;
  customer: CustomerInfo;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phoneCode: string;
  phone: string;
  specialRequests: string;
  travelerNames: string[];
}

export interface BookingResponse {
  reference: string;
  status: string;
}
