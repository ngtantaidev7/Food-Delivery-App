import { useMemo } from 'react';
import { CartItem } from '@/types/order';
import { Voucher } from '@/types/voucher';

export interface PriceCalculationResult {
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
}

export const usePriceCalculation = (
  items: CartItem[],
  voucher?: Voucher | null,
  baseDeliveryFee: number = 2.0
): PriceCalculationResult => {
  return useMemo(() => {
    const subtotal = Math.round(
      items.reduce((sum, item) => sum + (item.subtotalPrice || 0), 0) * 100
    ) / 100;

    let deliveryFee = items.length > 0 ? baseDeliveryFee : 0;
    let discountAmount = 0;

    if (voucher && subtotal >= voucher.minBillValue) {
      switch (voucher.type) {
        case 'percentage':
        case 'wallet_discount':
        case 'bill_threshold': {
          discountAmount = (subtotal * voucher.discountValue) / 100;
          if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
            discountAmount = voucher.maxDiscount;
          }
          break;
        }
        case 'fixed_shipping': {
          discountAmount = Math.min(deliveryFee, voucher.discountValue);
          break;
        }
        default:
          discountAmount = 0;
      }
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const rawTotal = subtotal + deliveryFee - discountAmount;
    const totalAmount = Math.max(0, Math.round(rawTotal * 100) / 100);

    return {
      subtotal,
      deliveryFee,
      discountAmount,
      totalAmount,
    };
  }, [items, voucher, baseDeliveryFee]);
};
