import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';
import { Food } from '../models/Food';
import { RestaurantReview } from '../models/RestaurantReview';
import { Voucher } from '../models/Voucher';

// Get list of restaurants with filtering and tags
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag, categoryId, search, sortBy, limit } = req.query;

    const filter: any = {};

    if (tag) {
      // Tags like 'Freeship', 'Near you', 'Deal $1', 'Popular'
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Restaurant.find(filter);

    if (sortBy === 'rating') {
      query = query.sort({ ratingAverage: -1 });
    } else if (sortBy === 'reviews') {
      query = query.sort({ totalReviews: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const restaurants = await query.exec();

    // If categoryId is specified, optionally filter restaurants that have foods in that category
    if (categoryId) {
      const foodsInCategory = await Food.find({ categoryId }).distinct('restaurantId');
      const filtered = restaurants.filter((r) =>
        foodsInCategory.some((fId) => fId.toString() === r._id.toString())
      );
      res.json({ success: true, count: filtered.length, data: filtered });
      return;
    }

    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single restaurant detail (Page 4)
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
      return;
    }

    // Also get active vouchers for this restaurant or general
    const vouchers = await Voucher.find({ isActive: true }).limit(2);

    res.json({
      success: true,
      data: {
        ...restaurant.toObject(),
        vouchers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get menu of restaurant grouped into sections (For you, Menu, Combo)
export const getRestaurantMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const foods = await Food.find({ restaurantId: id, isAvailable: true }).populate('categoryId');

    // Split foods into sections matching Page 4 UI:
    // - "For you" (items with high interest or default top 4)
    // - "Combo" (items containing 'Combo' in name)
    // - "Menu" (other dishes)
    const combos = foods.filter((f) => f.name.toLowerCase().includes('combo'));
    const regularFoods = foods.filter((f) => !f.name.toLowerCase().includes('combo'));
    const forYou = regularFoods.slice(0, 4);
    const menu = regularFoods.slice(4).length > 0 ? regularFoods.slice(4) : regularFoods;

    res.json({
      success: true,
      data: {
        all: foods,
        sections: {
          forYou,
          menu,
          combos,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews of restaurant (Page 4 - Reviews section)
export const getRestaurantReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reviews = await RestaurantReview.find({ restaurantId: id })
      .populate('customerId', 'fullName avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review for restaurant
export const addRestaurantReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { customerId, ratingStars, comment } = req.body;

    const review = await RestaurantReview.create({
      restaurantId: id,
      customerId,
      ratingStars: Number(ratingStars),
      comment,
    });

    // Update restaurant rating average and total reviews
    const reviews = await RestaurantReview.find({ restaurantId: id });
    const avg = reviews.reduce((sum, r) => sum + r.ratingStars, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(id, {
      ratingAverage: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
