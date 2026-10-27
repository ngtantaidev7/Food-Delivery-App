import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/user/:customerId?', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/cancel', cancelOrder);

export default router;
