import { Router } from 'express';
import { searchFoods, getFoodById } from '../controllers/foodController';

const router = Router();

router.get('/search', searchFoods);
router.get('/:id', getFoodById);

export default router;
