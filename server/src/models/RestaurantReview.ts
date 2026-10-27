import { Schema, model, Document } from 'mongoose';

export interface IRestaurantReview extends Document {
  restaurantId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  ratingStars: number; // 1 -> 5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantReviewSchema = new Schema<IRestaurantReview>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ratingStars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const RestaurantReview = model<IRestaurantReview>('RestaurantReview', RestaurantReviewSchema);
export default RestaurantReview;
