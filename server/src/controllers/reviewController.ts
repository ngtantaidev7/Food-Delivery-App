import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DriverReview } from '../models/DriverReview';
import { RestaurantReview } from '../models/RestaurantReview';
import { Restaurant } from '../models/Restaurant';
import { User } from '../models/User';

/** POST /api/reviews/driver — Submit driver review (Page 12) */
export const createDriverReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, customerId, driverId, ratingStars, tags, comment } = req.body;

    if (!orderId || !ratingStars) {
      res.status(400).json({ success: false, message: 'orderId and ratingStars are required' });
      return;
    }

    if (!mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid orderId format' });
      return;
    }

    let finalCustomerId = customerId;
    if (!finalCustomerId || !mongoose.isValidObjectId(finalCustomerId)) {
      const defaultUser = await User.findOne({ role: 'customer' }).select('_id');
      finalCustomerId = defaultUser?._id;
    }

    const review = await DriverReview.create({
      orderId,
      customerId: finalCustomerId,
      driverId: driverId && mongoose.isValidObjectId(driverId) ? driverId : undefined,
      ratingStars: Number(ratingStars),
      tags: Array.isArray(tags) ? tags : [],
      comment: comment?.trim(),
    });

    res.status(201).json({ success: true, message: 'Driver review submitted successfully', data: review });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'You have already reviewed this driver for this order' });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/reviews/driver/:driverId — Get reviews for a driver */
export const getDriverReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params;
    if (!mongoose.isValidObjectId(driverId)) {
      res.status(400).json({ success: false, message: 'Invalid driverId' });
      return;
    }

    const reviews = await DriverReview.find({ driverId })
      .populate('customerId', 'fullName avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** POST /api/reviews/restaurant — Submit restaurant review with aggregation rating calculation */
export const createRestaurantReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, customerId, ratingStars, comment } = req.body;

    if (!restaurantId || !ratingStars) {
      res.status(400).json({ success: false, message: 'restaurantId and ratingStars are required' });
      return;
    }

    if (!mongoose.isValidObjectId(restaurantId)) {
      res.status(400).json({ success: false, message: 'Invalid restaurantId' });
      return;
    }

    let finalCustomerId = customerId;
    if (!finalCustomerId || !mongoose.isValidObjectId(finalCustomerId)) {
      const defaultUser = await User.findOne({ role: 'customer' }).select('_id');
      finalCustomerId = defaultUser?._id;
    }

    const review = await RestaurantReview.create({
      restaurantId,
      customerId: finalCustomerId,
      ratingStars: Number(ratingStars),
      comment: comment?.trim() || '',
    });

    // High performance MongoDB aggregation for average rating and count
    const stats = await RestaurantReview.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$ratingStars' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    }

    res.status(201).json({ success: true, message: 'Restaurant review submitted successfully', data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
