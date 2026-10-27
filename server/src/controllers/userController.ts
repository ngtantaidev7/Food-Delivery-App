import { Request, Response } from 'express';
import { User } from '../models/User';

// Get current user profile (or default customer for demo)
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let user = null;

    if (id && id !== 'current') {
      user = await User.findById(id);
    } else {
      // Return the first customer found as default demo user
      user = await User.findOne({ role: 'customer' });
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add or update an address (Page 7 - Select location)
export const addOrUpdateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, label, addressLine, coordinates, isDefault } = req.body;

    let user = userId ? await User.findById(userId) : await User.findOne({ role: 'customer' });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const newAddress = {
      label: label || 'Home',
      addressLine,
      location: {
        type: 'Point' as const,
        coordinates: coordinates || [106.682, 10.7769], // [lng, lat]
      },
      isDefault: Boolean(isDefault),
    };

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Check if label already exists
    const existingIndex = user.addresses.findIndex((addr) => addr.label === label);
    if (existingIndex > -1) {
      user.addresses[existingIndex] = newAddress;
    } else {
      user.addresses.push(newAddress);
    }

    await user.save();

    res.json({ success: true, message: 'Address updated successfully', data: user.addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get default or assigned driver (Page 10/11 - John Cooper)
export const getDriverInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let driver = null;

    if (id) {
      driver = await User.findOne({ _id: id, role: 'driver' });
    }
    if (!driver) {
      driver = await User.findOne({ role: 'driver', fullName: 'John Cooper' }) || await User.findOne({ role: 'driver' });
    }

    if (!driver) {
      res.status(404).json({ success: false, message: 'Driver not found' });
      return;
    }

    res.json({ success: true, data: driver });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
