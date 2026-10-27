import { Router } from 'express';
import { getVouchers, applyVoucher } from '../controllers/voucherController';

const router = Router();

router.get('/', getVouchers);
router.post('/apply', applyVoucher);

export default router;
