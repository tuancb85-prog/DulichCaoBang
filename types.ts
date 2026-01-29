
export interface Review {
  id: string;
  userName: string;
  email: string;
  visitDate: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  coordinates: string;
}
