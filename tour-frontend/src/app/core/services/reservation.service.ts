import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { type Reservation, type BookingRequest, type BookingResponse } from '../models/reservation.model';
import { initialReservations } from '../../shared/data/platform.mock';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly base = `${environment.apiGatewayUrl}${environment.apiPaths.reservations}`;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/reservations — retourne des mocks en l'absence du backend */
  getAll(): Observable<Reservation[]> {
    // TODO: return this.http.get<Reservation[]>(`${this.base}/reservations`);
    return of([...initialReservations]).pipe(delay(0));
  }

  /** POST /api/v1/reservations — crée une réservation */
  create(booking: BookingRequest): Observable<BookingResponse> {
    // TODO: return this.http.post<BookingResponse>(`${this.base}/reservations`, booking);
    return of({
      reference: `TOUR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'confirmed',
    }).pipe(delay(900));
  }

  /** PATCH /api/v1/reservations/:ref/cancel */
  cancel(reference: string): Observable<Reservation> {
    // TODO: return this.http.patch<Reservation>(`${this.base}/reservations/${reference}/cancel`, {});
    const reservation = initialReservations.find((r) => r.reference === reference);
    return of({ ...reservation!, status: 'Annulée' as const }).pipe(delay(300));
  }

  searchAvailableTours(): Observable<{ available: boolean }> {
    return of({ available: true }).pipe(delay(1000));
  }
}
