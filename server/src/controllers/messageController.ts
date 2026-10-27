import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message';

/** GET /api/messages/:orderId — Get chat history for an order */
export const getOrderMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    if (!mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid orderId format' });
      return;
    }

    const messages = await Message.find({ orderId })
      .populate('senderId', 'fullName avatarUrl role')
      .populate('receiverId', 'fullName avatarUrl role')
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** POST /api/messages — Send message via REST API */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, senderId, receiverId, text, attachmentUrl } = req.body;

    if (!orderId || !senderId || !receiverId) {
      res.status(400).json({ success: false, message: 'orderId, senderId, and receiverId are required' });
      return;
    }

    if (!mongoose.isValidObjectId(orderId) || !mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(receiverId)) {
      res.status(400).json({ success: false, message: 'Invalid ID format' });
      return;
    }

    if (!text?.trim() && !attachmentUrl) {
      res.status(400).json({ success: false, message: 'Message text or attachment is required' });
      return;
    }

    const message = await Message.create({
      orderId,
      senderId,
      receiverId,
      text: text?.trim(),
      attachmentUrl,
      isRead: false,
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'fullName avatarUrl role')
      .populate('receiverId', 'fullName avatarUrl role')
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** PATCH /api/messages/:orderId/read — Mark messages as read */
export const markMessagesAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ success: false, message: 'Invalid orderId format' });
      return;
    }

    const filter: any = { orderId, isRead: false };
    if (userId && mongoose.isValidObjectId(userId)) {
      filter.receiverId = userId;
    }

    await Message.updateMany(filter, { isRead: true });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
