import { Schema, model, Document } from 'mongoose';

export interface IOrderItem {
  foodId: Schema.Types.ObjectId;
  foodName: string;
  basePrice: number;
  size: { name: string; extraPrice: number };
  toppings: Array<{ name: string; extraPrice: number }>;
  spiciness: string;
  specialNote?: string;
  quantity: number;
  subtotalPrice: number;
}

export interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  restaurantId: Schema.Types.ObjectId;
  driverId?: Schema.Types.ObjectId;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
  };
  voucherApplied?: Schema.Types.ObjectId;
  deliveryAddress: {
    addressLine: string;
    label: string;
    coordinates: [number, number];
  };
  status: 'confirm_order' | 'look_for_driver' | 'prepare_food' | 'deliver' | 'arrived' | 'cancelled';
  paymentMethod: 'E-wallet' | 'Cash' | 'Credit Card';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
        foodName: { type: String, required: true },
        basePrice: { type: Number, required: true },
        size: {
          name: { type: String, required: true },
          extraPrice: { type: Number, default: 0 },
        },
        toppings: [
          {
            name: { type: String },
            extraPrice: { type: Number, default: 0 },
          },
        ],
        spiciness: { type: String, default: 'No' },
        specialNote: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        subtotalPrice: { type: Number, required: true },
      },
    ],
    pricing: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    voucherApplied: { type: Schema.Types.ObjectId, ref: 'Voucher' },
    deliveryAddress: {
      addressLine: { type: String, required: true },
      label: { type: String, default: 'Home' },
      coordinates: { type: [Number], required: true },
    },
    status: {
      type: String,
      enum: ['confirm_order', 'look_for_driver', 'prepare_food', 'deliver', 'arrived', 'cancelled'],
      default: 'confirm_order',
      index: true,
    },
    paymentMethod: { type: String, enum: ['E-wallet', 'Cash', 'Credit Card'], default: 'E-wallet' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  },
  { timestamps: true }
);

OrderSchema.index({ customerId: 1, status: 1 });

export const Order = model<IOrder>('Order', OrderSchema);
export default Order;
