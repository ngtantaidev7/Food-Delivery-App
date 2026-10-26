import { Schema, model, Document } from 'mongoose';

export interface IDriverReview extends Document {
  orderId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  driverId: Schema.Types.ObjectId;
  ratingStars: number; // 1 -> 5
  tags: string[];      // ['Service', 'Supportive', 'Friendly', 'Delivery', 'Contactless']
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DriverReviewSchema = new Schema<IDriverReview>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ratingStars: { type: Number, required: true, min: 1, max: 5 },
    tags: [{ type: String }],
    comment: { type: String },
  },
  { timestamps: true }
);

export const DriverReview = model<IDriverReview>('DriverReview', DriverReviewSchema);
export default DriverReview;
