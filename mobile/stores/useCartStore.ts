import { create } from 'zustand';
import { CartItem } from '@/types/order';
import { FoodSizeOption, FoodToppingOption } from '@/types/food';

interface CartState {
  restaurantId: string | null;
  restaurantName: string;
  items: CartItem[];
  // Actions
  addItem: (params: {
    foodId: string;
    foodName: string;
    imageUrl: string;
    basePrice: number;
    size: FoodSizeOption;
    toppings: FoodToppingOption[];
    spiciness: string;
    specialNote?: string;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
  }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  // Derived
  totalItems: () => number;
  subtotal: () => number;
}

function calcSubtotal(item: Omit<CartItem, 'id' | 'subtotalPrice'>): number {
  const toppingTotal = item.toppings.reduce((s, t) => s + t.extraPrice, 0);
  return Math.round((item.basePrice + item.size.extraPrice + toppingTotal) * item.quantity * 100) / 100;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: '',
  items: [],

  addItem: (params) => {
    const { restaurantId, restaurantName, ...foodParams } = params;

    set((state) => {
      // If adding from a different restaurant, clear previous cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          restaurantId,
          restaurantName,
          items: [],
        };
      }
      return { restaurantId, restaurantName };
    });

    const id = `${params.foodId}-${Date.now()}`;
    const subtotalPrice = calcSubtotal(foodParams);
    set((state) => ({
      items: [...state.items, { id, ...foodParams, subtotalPrice }],
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, subtotalPrice: calcSubtotal({ ...item, quantity }) }
          : item
      ),
    }));
  },

  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: '' }),

  totalItems: () => get().items.reduce((n, i) => n + i.quantity, 0),
  subtotal: () => get().items.reduce((s, i) => s + i.subtotalPrice, 0),
}));
