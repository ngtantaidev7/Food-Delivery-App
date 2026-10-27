import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Voucher } from '../models/Voucher';

/** GET /api/vouchers — Get active vouchers sorted by minimum spend */
export const getVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    const vouchers = await Voucher.find({ isActive: true })
      .sort({ minBillValue: 1 })
      .lean();
    res.json({ success: true, count: vouchers.length, data: vouchers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** POST /api/vouchers/apply — Validate and calculate voucher discount */
export const applyVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { voucherId, subtotal, deliveryFee = 2, paymentMethod = 'E-wallet' } = req.body;

    if (!voucherId || !mongoose.isValidObjectId(voucherId)) {
      res.status(400).json({ success: false, message: 'Valid voucherId is required' });
      return;
    }

    const numSubtotal = Number(subtotal);
    if (isNaN(numSubtotal) || numSubtotal < 0) {
      res.status(400).json({ success: false, message: 'Invalid subtotal amount' });
      return;
    }

    const voucher = await Voucher.findById(voucherId).lean();
    if (!voucher || !voucher.isActive) {
      res.status(400).json({ success: false, message: 'Voucher is invalid or has expired' });
      return;
    }

    // Check minimum bill requirement
    if (numSubtotal < voucher.minBillValue) {
      res.status(400).json({
        success: false,
        message: `Voucher requires a minimum bill of $${voucher.minBillValue.toFixed(2)}`,
      });
      return;
    }

    // Check payment method constraint
    if (voucher.type === 'wallet_discount' && paymentMethod !== 'E-wallet') {
      res.status(400).json({
        success: false,
        message: 'This voucher is only valid for E-wallet payments',
      });
      return;
    }

    let discountAmount = 0;
    const numDeliveryFee = Math.max(0, Number(deliveryFee) || 0);

    switch (voucher.type) {
      case 'percentage':
      case 'wallet_discount':
      case 'bill_threshold':
        discountAmount = (numSubtotal * voucher.discountValue) / 100;
        if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
          discountAmount = voucher.maxDiscount;
        }
        break;

      case 'fixed_shipping':
        discountAmount = Math.min(numDeliveryFee, voucher.discountValue);
        break;

      default:
        discountAmount = 0;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const totalAmount = Math.max(0, Math.round((numSubtotal + numDeliveryFee - discountAmount) * 100) / 100);

    res.json({
      success: true,
      voucher,
      pricing: {
        subtotal: numSubtotal,
        deliveryFee: numDeliveryFee,
        discountAmount,
        totalAmount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
