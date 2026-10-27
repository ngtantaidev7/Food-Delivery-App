import { Router } from 'express';
import {
  getOrderMessages,
  sendMessage,
  markMessagesAsRead,
} from '../controllers/messageController';

const router = Router();

router.get('/:orderId', getOrderMessages);
router.post('/', sendMessage);
router.patch('/:orderId/read', markMessagesAsRead);

export default router;
