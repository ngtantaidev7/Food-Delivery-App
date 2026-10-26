export interface UserAddress {
  id?: string;
  label: 'Home' | 'Work' | 'Other';
  addressLine: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  isDefault: boolean;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'customer' | 'driver' | 'admin';
  avatarUrl?: string;
  addresses: UserAddress[];
  isActive: boolean;
}
