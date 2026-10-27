import { Request, Response } from 'express';
import { Voucher } from '../models/Voucher';

// Get list of active vouchers (Page 6)
export const getVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    const vouchers = await Voucher.find({ isActive: true }).sort({ minBillValue: 1 });
    res.json({ success: true, count: vouchers.length, data: vouchers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate and calculate discount for a voucher (Page 6 & 8)
export const applyVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { voucherId, subtotal, deliveryFee = 2, paymentMethod = 'E-wallet' } = req.body;

    const voucher = await Voucher.findById(voucherId);
    if (!voucher || !voucher.isActive) {
      res.status(400).json({ success: false, message: 'Voucher is invalid or expired' });
      return;
    }

    // Check minimum bill value
    if (subtotal < voucher.minBillValue) {
      res.status(400).json({
        success: false,
        message: `Voucher requires a minimum bill of $${voucher.minBillValue}`,
      });
      return;
    }

    // Check payment method for wallet voucher
    if (voucher.type === 'wallet_discount' && paymentMethod !== 'E-wallet') {
      res.status(400).json({
        success: false,
        message: 'This voucher is only valid for E-wallet payment method',
      });
      return;
    }

    let discountAmount = 0;

    switch (voucher.type) {
      case 'percentage':
      case 'wallet_discount':
      case 'bill_threshold':
        discountAmount = (subtotal * voucher.discountValue) / 100;
        if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
          discountAmount = voucher.maxDiscount;
        }
        break;

      case 'fixed_shipping':
        discountAmount = Math.min(deliveryFee, voucher.discountValue);
        break;

      default:
        discountAmount = 0;
    }

    // Round to 1 decimal place
    discountAmount = Math.round(discountAmount * 10) / 10;
    const finalTotal = Math.max(0, Math.round((subtotal + deliveryFee - discountAmount) * 10) / 10);

    res.json({
      success: true,
      voucher,
      pricing: {
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount: finalTotal,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
