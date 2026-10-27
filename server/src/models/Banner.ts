import { Schema, model, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  dealText?: string;       // e.g. "$1"
  buttonText?: string;     // e.g. "SEE MORE"
  placement: 'home' | 'category';
  categorySlug?: string;   // if placement is category (e.g. 'fast-food')
  targetType?: 'restaurant' | 'category' | 'voucher' | 'external';
  targetId?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    dealText: { type: String },
    buttonText: { type: String, default: 'SEE MORE' },
    placement: { type: String, enum: ['home', 'category'], default: 'home', index: true },
    categorySlug: { type: String },
    targetType: { type: String, enum: ['restaurant', 'category', 'voucher', 'external'] },
    targetId: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = model<IBanner>('Banner', BannerSchema);
export default Banner;
