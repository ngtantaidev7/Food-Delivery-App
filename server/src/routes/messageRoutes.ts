import { Router } from 'express';
import { getOrderMessages, sendMessage } from '../controllers/messageController';

const router = Router();

router.get('/:orderId', getOrderMessages);
router.post('/', sendMessage);

export default router;
