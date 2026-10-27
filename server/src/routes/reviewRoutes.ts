import { Router } from 'express';
import { createDriverReview, getDriverReviews } from '../controllers/reviewController';

const router = Router();

router.post('/driver', createDriverReview);
router.get('/driver/:driverId', getDriverReviews);

export default router;
