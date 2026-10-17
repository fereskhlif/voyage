import { type Circuit } from '../../core/models/circuit.model';
import { type Reservation } from '../../core/models/reservation.model';

export const circuits: Circuit[] = [
  {
    id: 'tunis-patrimoine',
    name: 'Tunis, Carthage & Sidi Bou Saïd',
    location: 'Grand Tunis',
    description: 'Une journée entre médina, vestiges puniques et ruelles bleues sur la Méditerranée.',
    duration: '9 h', distance: '42 km',
    image: 'https://images.unsplash.com/photo-1607869861980-da5f9b8b4969?auto=format&fit=crop&w=1200&q=85',
    linkedTrip: 'Escapade culturelle à Tunis',
    steps: [
      { name: 'Médina de Tunis', time: '08:30', duration: '2 h', distance: 'Départ', description: 'Visite guidée des souks, patios et monuments historiques.' },
      { name: 'Site archéologique de Carthage', time: '11:30', duration: '2 h 30', distance: '16 km', description: 'Découverte des thermes d\'Antonin et des vestiges antiques.' },
      { name: 'Sidi Bou Saïd', time: '15:30', duration: '2 h', distance: '6 km', description: 'Promenade libre dans le village bleu et blanc avec vue sur le golfe.' },
    ],
  },
  {
    id: 'djerba-authentique',
    name: 'Djerba authentique',
    location: 'Île de Djerba',
    description: 'Plages, patrimoine insulaire et ateliers traditionnels au cœur de l\'île.',
    duration: '7 h 30', distance: '68 km',
    image: 'https://images.unsplash.com/photo-1598554200951-b9f36526ecd9?auto=format&fit=crop&w=1200&q=85',
    linkedTrip: 'Séjour détente à Djerba',
    steps: [
      { name: 'Houmt Souk', time: '09:00', duration: '1 h 30', distance: 'Départ', description: 'Marché traditionnel, port et découverte de l\'artisanat local.' },
      { name: 'Djerbahood', time: '11:15', duration: '1 h 30', distance: '12 km', description: 'Parcours d\'art urbain dans le village d\'Erriadh.' },
      { name: 'Plage de Sidi Mahrez', time: '14:30', duration: '2 h 30', distance: '24 km', description: 'Temps libre sur une plage de sable fin.' },
    ],
  },
  {
    id: 'carthage-antique',
    name: 'Carthage antique',
    location: 'Carthage',
    description: 'Un parcours approfondi au fil des principaux sites archéologiques de Carthage.',
    duration: '5 h', distance: '18 km',
    image: 'https://images.unsplash.com/photo-1755463083594-8cd2d1e2135e?auto=format&fit=crop&w=1200&q=85',
    linkedTrip: 'Week-end histoire & Méditerranée',
    steps: [
      { name: 'Colline de Byrsa', time: '09:00', duration: '1 h 30', distance: 'Départ', description: 'Panorama et musée du site de Carthage.' },
      { name: 'Ports puniques', time: '11:00', duration: '1 h', distance: '3 km', description: 'Lecture du paysage maritime de l\'ancienne cité.' },
      { name: 'Thermes d\'Antonin', time: '12:30', duration: '1 h 30', distance: '4 km', description: 'Visite des vestiges monumentaux en bord de mer.' },
    ],
  },
];

export const initialReservations: Reservation[] = [
  { reference: 'TOUR-2026-48215', destination: 'Djerba', dates: '12–18 juin 2026', travelers: 2, amount: 1890, status: 'Confirmée', names: ['Amira Ben Salah', 'Youssef Ben Salah'] },
  { reference: 'TOUR-2026-51704', destination: 'Sidi Bou Saïd', dates: '3–6 juillet 2026', travelers: 1, amount: 740, status: 'En attente', names: ['Amira Ben Salah'] },
  { reference: 'TOUR-2025-39812', destination: 'Carthage', dates: '14–16 décembre 2025', travelers: 2, amount: 980, status: 'Annulée', names: ['Amira Ben Salah', 'Leïla Trabelsi'] },
];
