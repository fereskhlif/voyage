import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { type Circuit } from '../models/circuit.model';
import { circuits } from '../../shared/data/platform.mock';

@Injectable({ providedIn: 'root' })
export class CircuitService {
  private readonly base = `${environment.apiGatewayUrl}${environment.apiPaths.circuits}`;

  constructor(private http: HttpClient) {}

  /** Récupère tous les circuits via /api/circuits — retourne des mocks si le backend n'est pas disponible */
  getAll(): Observable<Circuit[]> {
    // TODO: décommenter quand /api/circuits est opérationnel
    // return this.http.get<Circuit[]>(this.base);
    return of(circuits).pipe(delay(0));
  }

  getById(id: string): Observable<Circuit | undefined> {
    // TODO: return this.http.get<Circuit>(`${this.base}/${id}`);
    return of(circuits.find((c) => c.id === id)).pipe(delay(0));
  }
}
