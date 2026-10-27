export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  openTime: string;
  closeTime: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  ratingAverage: number;
  totalReviews: number;
  tags: string[]; // ['Freeship', 'Near you', 'Deal $1', 'Popular']
  priceRange: {
    min: number;
    max: number;
  };
  distanceKm?: number;
  estimateDeliveryMinutes?: number;
}
