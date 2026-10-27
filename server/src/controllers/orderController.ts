import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';

// Create a new order (Page 8 - Order review / Checkout)
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerId,
      restaurantId,
      items,
      pricing,
      voucherApplied,
      deliveryAddress,
      paymentMethod = 'E-wallet',
    } = req.body;

    // Fallback to first customer if customerId is not passed in demo
    let finalCustomerId = customerId;
    if (!finalCustomerId) {
      const defaultCustomer = await User.findOne({ role: 'customer' });
      finalCustomerId = defaultCustomer?._id;
    }

    // Assign John Cooper as driver by default for tracking and chat flow
    const driver = await User.findOne({ role: 'driver', fullName: 'John Cooper' }) || await User.findOne({ role: 'driver' });

    const order = await Order.create({
      customerId: finalCustomerId,
      restaurantId,
      driverId: driver?._id,
      items,
      pricing,
      voucherApplied: voucherApplied || undefined,
      deliveryAddress,
      paymentMethod,
      status: 'confirm_order',
      paymentStatus: paymentMethod === 'Cash' ? 'pending' : 'completed',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurantId')
      .populate('driverId')
      .populate('voucherApplied');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order detail (Page 9, 10)
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('restaurantId')
      .populate('driverId', 'fullName phone avatarUrl')
      .populate('voucherApplied');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for a customer ("My order" tab)
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    let queryCustomerId = customerId;

    if (!queryCustomerId || queryCustomerId === 'current') {
      const defaultCustomer = await User.findOne({ role: 'customer' });
      queryCustomerId = defaultCustomer?._id?.toString() || '';
    }

    const orders = await Order.find({ customerId: queryCustomerId })
      .populate('restaurantId', 'name imageUrl address')
      .populate('driverId', 'fullName phone avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Page 9 - stepper)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body;

    const validStatuses = ['confirm_order', 'look_for_driver', 'prepare_food', 'deliver', 'arrived', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const updateData: any = { status };
    if (driverId) {
      updateData.driverId = driverId;
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('restaurantId')
      .populate('driverId', 'fullName phone avatarUrl');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order (Page 9 - Cancel button)
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (order.status === 'deliver' || order.status === 'arrived') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel order once food is out for delivery',
      });
      return;
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
