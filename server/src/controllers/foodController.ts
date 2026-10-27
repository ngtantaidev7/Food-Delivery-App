import { Request, Response } from 'express';
import { Food } from '../models/Food';

/** GET /api/foods/search?q=...&tag=...
 *  Finds foods matching the query and groups results by restaurant.
 *  Page 3: search "Fried Chicken" → Hana Chicken with matching items listed beneath.
 */
export const searchFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;

    const filter: Record<string, any> = { isAvailable: true };
    if (q) filter.name = { $regex: q, $options: 'i' };

    const foods = await Food.find(filter).populate('restaurantId');

    // Group by restaurant using a Map for O(n) performance
    const map = new Map<string, { restaurant: any; items: any[] }>();
    for (const food of foods) {
      const rest = food.restaurantId as any;
      if (!rest) continue;
      if (tag && !rest.tags?.includes(tag)) continue;

      const key = rest._id.toString();
      if (!map.has(key)) {
        map.set(key, { restaurant: rest, items: [] });
      }
      map.get(key)!.items.push({
        _id: food._id,
        name: food.name,
        basePrice: food.basePrice,
        imageUrl: food.imageUrl,
        description: food.description,
      });
    }

    const groupedResults = Array.from(map.values());

    res.json({ success: true, query: q, totalCount: foods.length, groupedResults });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/foods/:id — food detail with sizes, toppings, spiciness (Page 5) */
export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('restaurantId', 'name address imageUrl openTime closeTime')
      .populate('categoryId', 'name slug');

    if (!food) {
      res.status(404).json({ success: false, message: 'Food item not found' });
      return;
    }

    res.json({ success: true, data: food });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
