import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/db';
import { Message } from './models/Message';
import { Order } from './models/Order';

// Import Routes
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

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// API Routes
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

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Food Delivery API is running',
    timestamp: new Date().toISOString(),
  });
});

// Socket.io for Realtime chat & Driver Tracking
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // Join order room for tracking and chat
  socket.on('join_order_room', (orderId: string) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined room ${orderId}`);
  });

  // Leave order room
  socket.on('leave_order_room', (orderId: string) => {
    socket.leave(orderId);
    console.log(`Socket ${socket.id} left room ${orderId}`);
  });

  // Send message - saves directly to MongoDB & broadcasts
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
      console.error('Socket send_message error:', err);
    }
  });

  // Driver GPS location update - broadcasts to customer in order room
  socket.on('driver_location_update', (data: {
    orderId: string;
    coordinates: [number, number]; // [longitude, latitude]
    heading?: number;
    etaMinutes?: number;
  }) => {
    io.to(data.orderId).emit('driver_location_changed', data);
  });

  // Order status transition broadcast
  socket.on('order_status_update', async (data: { orderId: string; status: string }) => {
    try {
      const order = await Order.findByIdAndUpdate(data.orderId, { status: data.status }, { new: true })
        .populate('restaurantId')
        .populate('driverId');

      io.to(data.orderId).emit('order_status_changed', order);
    } catch (err) {
      console.error('Socket order_status_update error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

export { app, server, io };
