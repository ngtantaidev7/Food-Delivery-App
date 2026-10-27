import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// dotenv MUST be loaded before any module that reads process.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from './config/db';
import { Message } from './models/Message';
import { Order } from './models/Order';

// Routes
import uploadRoutes from './routes/upload';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import bannerRoutes from './routes/bannerRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import foodRoutes from './routes/foodRoutes';
import voucherRoutes from './routes/voucherRoutes';
import orderRoutes from './routes/orderRoutes';
import messageRoutes from './routes/messageRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
  pingTimeout: 60000,
});

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── REST API Routes ────────────────────────────────────────────────────────────
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Food Delivery API is running', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Socket.IO — Realtime Chat & Driver Tracking ────────────────────────────────
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  /** Join a per-order room for both chat and tracking */
  socket.on('join_order_room', (orderId: string) => {
    socket.join(orderId);
  });

  /** Leave order room on explicit request */
  socket.on('leave_order_room', (orderId: string) => {
    socket.leave(orderId);
  });

  /**
   * Chat message: persist to MongoDB first, then broadcast to room.
   * Ensures message history is never lost even if a client disconnects.
   */
  socket.on('send_message', async (data: {
    orderId: string;
    senderId: string;
    receiverId: string;
    text?: string;
    attachmentUrl?: string;
  }) => {
    try {
      const message = await Message.create({
        orderId: data.orderId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        attachmentUrl: data.attachmentUrl,
        isRead: false,
      });

      const populated = await Message.findById(message._id)
        .populate('senderId', 'fullName avatarUrl role')
        .populate('receiverId', 'fullName avatarUrl role');

      io.to(data.orderId).emit('receive_message', populated);
    } catch (err) {
      console.error('[socket] send_message error:', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Driver GPS update — broadcast location + heading + ETA to order room.
   * Only the customer tracking screen listens for this event.
   */
  socket.on('driver_location_update', (data: {
    orderId: string;
    coordinates: [number, number]; // [lng, lat]
    heading?: number;
    etaMinutes?: number;
  }) => {
    io.to(data.orderId).emit('driver_location_changed', data);
  });

  /**
   * Order status change — persist to DB and broadcast updated order.
   * Used by the status stepper on both customer and driver side.
   */
  socket.on('order_status_update', async (data: { orderId: string; status: string }) => {
    try {
      const order = await Order.findByIdAndUpdate(
        data.orderId,
        { status: data.status },
        { new: true }
      )
        .populate('restaurantId', 'name imageUrl address')
        .populate('driverId', 'fullName phone avatarUrl');

      if (order) {
        io.to(data.orderId).emit('order_status_changed', order);
      }
    } catch (err) {
      console.error('[socket] order_status_update error:', err);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
  });
});

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running → http://localhost:${PORT}`);
  });
});

export { app, server, io };
