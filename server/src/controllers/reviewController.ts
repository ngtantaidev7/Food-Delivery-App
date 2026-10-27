import { Request, Response } from 'express';
import { DriverReview } from '../models/DriverReview';

// Submit driver review (Page 12)
export const createDriverReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, customerId, driverId, ratingStars, tags, comment } = req.body;

    if (!orderId || !ratingStars) {
      res.status(400).json({ success: false, message: 'orderId and ratingStars are required' });
      return;
    }

    const review = await DriverReview.create({
      orderId,
      customerId,
      driverId,
      ratingStars: Number(ratingStars),
      tags: tags || [],
      comment,
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

// Get reviews of a driver
export const getDriverReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.params;
    const reviews = await DriverReview.find({ driverId })
      .populate('customerId', 'fullName avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
