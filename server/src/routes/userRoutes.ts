import { Router } from 'express';
import { getProfile, addOrUpdateAddress, getDriverInfo } from '../controllers/userController';

const router = Router();

router.get('/profile/:id?', getProfile);
router.post('/address', addOrUpdateAddress);
router.get('/driver/:id?', getDriverInfo);

export default router;
