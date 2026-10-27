import { Request, Response } from 'express';
import { Food } from '../models/Food';
import { Restaurant } from '../models/Restaurant';

// Search foods and group by restaurant (Page 3)
export const searchFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, tag } = req.query;
    const searchString = typeof q === 'string' ? q.trim() : '';

    const foodFilter: any = { isAvailable: true };
    if (searchString) {
      foodFilter.name = { $regex: searchString, $options: 'i' };
    }

    // Find all matching foods and populate restaurant
    const foods = await Food.find(foodFilter).populate('restaurantId');

    // Group foods by restaurant
    const restaurantMap = new Map<string, { restaurant: any; items: any[] }>();

    for (const food of foods) {
      const rest = food.restaurantId as any;
      if (!rest) continue;

      if (tag && !rest.tags?.includes(tag)) {
        continue;
      }

      const restId = rest._id.toString();
      if (!restaurantMap.has(restId)) {
        restaurantMap.set(restId, {
          restaurant: rest,
          items: [],
        });
      }
      restaurantMap.get(restId)!.items.push({
        _id: food._id,
        name: food.name,
        basePrice: food.basePrice,
        imageUrl: food.imageUrl,
        description: food.description,
      });
    }

    const groupedResults = Array.from(restaurantMap.values());

    res.json({
      success: true,
      query: searchString,
      totalCount: foods.length,
      groupedResults,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get food details with options (Page 5)
export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id).populate('restaurantId', 'name address imageUrl');

    if (!food) {
      res.status(404).json({ success: false, message: 'Food item not found' });
      return;
    }

    res.json({ success: true, data: food });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
