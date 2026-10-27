import { Request, Response } from 'express';
import { Message } from '../models/Message';

// Get chat history for an order (Page 11)
export const getOrderMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const messages = await Message.find({ orderId })
      .populate('senderId', 'fullName avatarUrl role')
      .populate('receiverId', 'fullName avatarUrl role')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message via REST API
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, senderId, receiverId, text, attachmentUrl } = req.body;

    if (!text && !attachmentUrl) {
      res.status(400).json({ success: false, message: 'Message text or attachment is required' });
      return;
    }

    const message = await Message.create({
      orderId,
      senderId,
      receiverId,
      text,
      attachmentUrl,
      isRead: false,
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'fullName avatarUrl role')
      .populate('receiverId', 'fullName avatarUrl role');

    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
