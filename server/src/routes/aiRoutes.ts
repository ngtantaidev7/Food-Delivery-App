import { Router } from 'express';
import { aiChat, optimizeRoute } from '../controllers/aiController';

const router = Router();

// POST /api/ai/chat  — AI food recommendation chatbot
router.post('/chat', aiChat);

// POST /api/ai/route — Route optimization (Driver → Restaurant → Customer)
router.post('/route', optimizeRoute);

export default router;
