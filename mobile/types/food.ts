export interface FoodSizeOption {
  name: string; // 'S', 'M', 'L'
  extraPrice: number;
}

export interface FoodToppingOption {
  name: string; // 'Corn', 'Cheese Cheddar', 'Salted egg'
  extraPrice: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl: string;
  basePrice: number;
  options: {
    sizes: FoodSizeOption[];
    toppings: FoodToppingOption[];
    spicinessOptions: string[]; // ['No', 'Hot', 'Very hot']
  };
  isAvailable: boolean;
  ratingAverage?: number;
  totalReviews?: number;
}
