import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { User } from '../models/User';

const ORDER_POPULATE = [
  { path: 'restaurantId', select: 'name imageUrl address' },
  { path: 'driverId', select: 'fullName phone avatarUrl' },
  { path: 'voucherApplied', select: 'title type discountValue' },
] as const;

const VALID_STATUSES = [
  'confirm_order', 'look_for_driver', 'prepare_food', 'deliver', 'arrived', 'cancelled',
] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

/** POST /api/orders — Create order (Page 8 checkout) */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, restaurantId, items, pricing, voucherApplied, deliveryAddress, paymentMethod = 'E-wallet' } = req.body;

    // Resolve customer & driver concurrently
    const [customer, driver] = await Promise.all([
      customerId ? User.findById(customerId) : User.findOne({ role: 'customer' }),
      User.findOne({ role: 'driver', fullName: 'John Cooper' }).then(
        (d) => d ?? User.findOne({ role: 'driver' })
      ),
    ]);

    const order = await Order.create({
      customerId: customer?._id ?? customerId,
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

    const populated = await Order.findById(order._id).populate(ORDER_POPULATE as any);
    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/orders/:id — Order detail (Page 9, 10) */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(ORDER_POPULATE as any);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/orders/user/:customerId — Customer order history */
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    let { customerId } = req.params;
    if (!customerId || customerId === 'current') {
      const defaultCustomer = await User.findOne({ role: 'customer' }, '_id');
      customerId = defaultCustomer?._id?.toString() ?? '';
    }
    if (!customerId) {
      res.status(400).json({ success: false, message: 'customerId is required' });
      return;
    }

    const orders = await Order.find({ customerId })
      .populate('restaurantId', 'name imageUrl address')
      .populate('driverId', 'fullName phone avatarUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PATCH /api/orders/:id/status — Status stepper (Page 9) */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, driverId } = req.body as { status: OrderStatus; driverId?: string };

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` });
      return;
    }

    const update: Record<string, any> = { status };
    if (driverId) update.driverId = driverId;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('restaurantId', 'name imageUrl address')
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

/** POST /api/orders/:id/cancel — Cancel order (Page 9) */
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    if (order.status === 'deliver' || order.status === 'arrived') {
      res.status(400).json({ success: false, message: 'Cannot cancel order once food is out for delivery' });
      return;
    }
    if (order.status === 'cancelled') {
      res.status(400).json({ success: false, message: 'Order is already cancelled' });
      return;
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
