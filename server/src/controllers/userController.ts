import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';

/** GET /api/users/profile/:id — Get user profile (fallback to default customer if 'current' or omitted) */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let user = null;

    if (id && id !== 'current') {
      if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ success: false, message: 'Invalid user ID format' });
        return;
      }
      user = await User.findById(id).lean();
    } else {
      // Default demo customer
      user = await User.findOne({ role: 'customer' }).lean();
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

/** POST /api/users/address — Add or update delivery address */
export const addOrUpdateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, label = 'Home', addressLine, coordinates, isDefault } = req.body;

    if (!addressLine) {
      res.status(400).json({ success: false, message: 'addressLine is required' });
      return;
    }

    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ role: 'customer' });
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const newAddress = {
      label: (['Home', 'Work', 'Other'].includes(label) ? label : 'Home') as 'Home' | 'Work' | 'Other',
      addressLine,
      location: {
        type: 'Point' as const,
        coordinates: Array.isArray(coordinates) && coordinates.length === 2
          ? [Number(coordinates[0]), Number(coordinates[1])] as [number, number]
          : [106.682, 10.7769] as [number, number],
      },
      isDefault: Boolean(isDefault),
    };

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const existingIndex = user.addresses.findIndex((addr) => addr.label === label);
    if (existingIndex > -1) {
      user.addresses[existingIndex] = newAddress;
    } else {
      user.addresses.push(newAddress);
    }

    await user.save();

    res.json({ success: true, message: 'Address saved successfully', data: user.addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/users/driver/:id? — Get driver info (John Cooper or first driver) */
export const getDriverInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let driver = null;

    if (id && mongoose.isValidObjectId(id)) {
      driver = await User.findOne({ _id: id, role: 'driver' }).lean();
    }
    if (!driver) {
      driver = await User.findOne({ role: 'driver', fullName: 'John Cooper' }).lean()
        || await User.findOne({ role: 'driver' }).lean();
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
