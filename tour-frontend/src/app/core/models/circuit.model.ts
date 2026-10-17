export interface CircuitStep {
  name: string;
  time: string;
  duration: string;
  distance: string;
  description: string;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  description: string;
  duration: string;
  distance: string;
  image: string;
  linkedTrip: string;
  steps: CircuitStep[];
}
