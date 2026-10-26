export type VoucherType =
  | 'percentage'
  | 'fixed_shipping'
  | 'wallet_discount'
  | 'bill_threshold';

export interface Voucher {
  id: string;
  title: string;
  type: VoucherType;
  discountValue: number;
  minBillValue: number;
  maxDiscount?: number;
  validUntil: string | Date;
  isActive: boolean;
  icon?: string;
}
