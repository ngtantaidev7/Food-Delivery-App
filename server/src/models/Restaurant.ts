import { Schema, model, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  imageUrl: string;
  openTime: string;  // "06:00"
  closeTime: string; // "21:00"
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude] for Near you
  };
  address: string;
  ratingAverage: number;
  totalReviews: number;
  tags: string[]; // ['Freeship', 'Near you', 'Deal $1', 'Popular']
  priceRange: { min: number; max: number };
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    openTime: { type: String, default: '06:00' },
    closeTime: { type: String, default: '21:00' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    ratingAverage: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    priceRange: {
      min: { type: Number, default: 5 },
      max: { type: Number, default: 50 },
    },
  },
  { timestamps: true }
);

RestaurantSchema.index({ location: '2dsphere' });

export const Restaurant = model<IRestaurant>('Restaurant', RestaurantSchema);
export default Restaurant;
