import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string; // 'Rice', 'Healthy', 'Drink', 'Fastfood'
  slug: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    iconUrl: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);
export default Category;
