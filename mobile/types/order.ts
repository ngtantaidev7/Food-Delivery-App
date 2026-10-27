import { FoodSizeOption, FoodToppingOption } from './food';

export interface CartItem {
  id: string; // unique item id inside cart
  foodId: string;
  foodName: string;
  imageUrl: string;
  basePrice: number;
  size: FoodSizeOption;
  toppings: FoodToppingOption[];
  spiciness: string;
  specialNote?: string;
  quantity: number;
  subtotalPrice: number;
}

export type OrderStatus =
  | 'confirm_order'
  | 'look_for_driver'
  | 'prepare_food'
  | 'deliver'
  | 'arrived'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName?: string;
  driverId?: string;
  driverName?: string;
  items: CartItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
  };
  voucherApplied?: string;
  deliveryAddress: {
    addressLine: string;
    label: 'Home' | 'Work' | 'Other';
    coordinates: [number, number];
  };
  status: OrderStatus;
  paymentMethod: 'E-wallet' | 'Cash' | 'Credit Card';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  createdAt: string | Date;
}
