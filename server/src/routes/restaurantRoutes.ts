import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getRestaurantReviews,
  addRestaurantReview,
} from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);
router.get('/:id/foods', getRestaurantMenu); // alias: same handler as /menu
router.get('/:id/reviews', getRestaurantReviews);
router.post('/:id/reviews', addRestaurantReview);

export default router;
