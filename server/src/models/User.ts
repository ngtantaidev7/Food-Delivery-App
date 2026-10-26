import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  role: 'customer' | 'driver' | 'admin';
  avatarUrl?: string;
  addresses: Array<{
    label: 'Home' | 'Work' | 'Other';
    addressLine: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    isDefault: boolean;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true },
    role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer' },
    avatarUrl: { type: String },
    addresses: [
      {
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        addressLine: { type: String, required: true },
        location: {
          type: { type: String, enum: ['Point'], default: 'Point' },
          coordinates: { type: [Number], required: true },
        },
        isDefault: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ 'addresses.location': '2dsphere' });

export const User = model<IUser>('User', UserSchema);
export default User;
