export type DestinationCategory = 'Beach' | 'City Break' | 'Adventure' | 'Cultural' | 'Wellness' | 'Family';

export interface Destination {
  name: string;
  country: string;
  description: string;
  category: DestinationCategory;
  duration: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface Tour {
  id: string;
  destination: string;
  title: string;
  durationDays: number;
  type: DestinationCategory;
  pricePerPerson: number;
  rating: number;
  image: string;
  included: string[];
  availability: number;
}

export const categoryLabels: Record<DestinationCategory, string> = {
  Beach: 'Plage',
  'City Break': 'Escapade urbaine',
  Adventure: 'Aventure',
  Cultural: 'Culture',
  Wellness: 'Bien-être',
  Family: 'Famille',
};
