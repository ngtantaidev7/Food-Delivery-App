import { Schema, model, Document } from 'mongoose';

export interface IFood extends Document {
  restaurantId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  imageUrl: string;
  basePrice: number;
  options: {
    sizes: Array<{ name: string; extraPrice: number }>;
    toppings: Array<{ name: string; extraPrice: number }>;
    spicinessOptions: string[]; // ['No', 'Hot', 'Very hot']
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    basePrice: { type: Number, required: true },
    options: {
      sizes: [
        {
          name: { type: String, required: true },
          extraPrice: { type: Number, default: 0 },
        },
      ],
      toppings: [
        {
          name: { type: String, required: true },
          extraPrice: { type: Number, default: 0 },
        },
      ],
      spicinessOptions: { type: [String], default: ['No', 'Hot', 'Very hot'] },
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Food = model<IFood>('Food', FoodSchema);
export default Food;
