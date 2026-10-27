import { Router } from 'express';
import { createDriverReview, getDriverReviews, createRestaurantReview } from '../controllers/reviewController';

const router = Router();

router.post('/driver', createDriverReview);
router.get('/driver/:driverId', getDriverReviews);
router.post('/restaurant', createRestaurantReview);

export default router;
