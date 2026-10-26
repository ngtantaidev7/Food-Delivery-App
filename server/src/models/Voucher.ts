import { Schema, model, Document } from 'mongoose';

export interface IVoucher extends Document {
  title: string;
  type: 'percentage' | 'fixed_shipping' | 'wallet_discount' | 'bill_threshold';
  discountValue: number;
  minBillValue: number;
  maxDiscount?: number;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed_shipping', 'wallet_discount', 'bill_threshold'],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minBillValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Voucher = model<IVoucher>('Voucher', VoucherSchema);
export default Voucher;
