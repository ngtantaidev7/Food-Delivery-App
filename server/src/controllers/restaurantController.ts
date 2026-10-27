import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';
import { Food } from '../models/Food';
import { RestaurantReview } from '../models/RestaurantReview';
import { Voucher } from '../models/Voucher';

/** GET /api/restaurants — list with tag / categoryId / search / sort / limit */
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag, categoryId, search, sortBy, limit } = req.query;

    const filter: Record<string, any> = {};
    if (tag) filter.tags = { $in: [tag] };
    if (search) filter.name = { $regex: search, $options: 'i' };

    // If categoryId is given, find distinct restaurantIds that carry that category
    if (categoryId) {
      const restaurantIds = await Food.find({ categoryId }).distinct('restaurantId');
      filter._id = { $in: restaurantIds };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      rating: { ratingAverage: -1 },
      reviews: { totalReviews: -1 },
    };
    const sort = sortMap[sortBy as string] ?? { createdAt: -1 };

    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .limit(limit ? Number(limit) : 0);

    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/restaurants/:id — restaurant detail + top 2 active vouchers */
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    const [vouchers, reviewCount] = await Promise.all([
      Voucher.find({ isActive: true }).limit(2),
      RestaurantReview.countDocuments({ restaurantId: req.params.id }),
    ]);

    res.json({ success: true, data: { ...restaurant.toObject(), vouchers, reviewCount } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/restaurants/:id/menu  (also aliased to /foods) */
export const getRestaurantMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id, isAvailable: true })
      .populate('categoryId', 'name slug');

    const combos = foods.filter((f) => f.name.toLowerCase().includes('combo'));
    const regular = foods.filter((f) => !f.name.toLowerCase().includes('combo'));
    const forYou = regular.slice(0, 4);
    const menu = regular.length > 4 ? regular.slice(4) : regular;

    res.json({
      success: true,
      data: { all: foods, sections: { forYou, menu, combos } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/restaurants/:id/reviews */
export const getRestaurantReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await RestaurantReview.find({ restaurantId: req.params.id })
      .populate('customerId', 'fullName avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
