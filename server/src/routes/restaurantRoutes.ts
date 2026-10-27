import { Router } from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getRestaurantReviews,
} from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);
router.get('/:id/foods', getRestaurantMenu); // alias for mobile clients
router.get('/:id/reviews', getRestaurantReviews);

export default router;
