import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { Order, OrderStatus } from '@/types/order';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
const SOCKET_URL =
  (Constants.expoConfig?.extra?.apiUrl as string)?.replace('/api', '') ||
  (hostUri ? `http://${hostUri}:5000` : 'http://localhost:5000');

interface DriverLocation {
  coordinates: [number, number]; // [lng, lat]
  heading?: number;
  etaMinutes?: number;
}

interface OrderState {
  socket: Socket | null;
  activeOrder: Order | null;
  driverLocation: DriverLocation | null;
  isTracking: boolean;
  // Actions
  setActiveOrder: (order: Order) => void;
  clearActiveOrder: () => void;
  startTracking: (orderId: string) => void;
  stopTracking: () => void;
  updateStatus: (status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  socket: null,
  activeOrder: null,
  driverLocation: null,
  isTracking: false,

  setActiveOrder: (order) => set({ activeOrder: order }),

  clearActiveOrder: () => {
    get().stopTracking();
    set({ activeOrder: null, driverLocation: null });
  },

  startTracking: (orderId) => {
    const existing = get().socket;
    if (existing?.connected) return;

    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      socket.emit('join_order_room', orderId);
      set({ isTracking: true });
    });

    socket.on('driver_location_changed', (data: DriverLocation) => {
      set({ driverLocation: data });
    });

    socket.on('order_status_changed', (order: Order) => {
      set({ activeOrder: order });
    });

    socket.on('disconnect', () => {
      set({ isTracking: false });
    });

    set({ socket });
  },

  stopTracking: () => {
    const { socket, activeOrder } = get();
    if (socket) {
      socket.emit('leave_order_room', activeOrder?.id);
      socket.disconnect();
    }
    set({ socket: null, isTracking: false, driverLocation: null });
  },

  updateStatus: (status) => {
    set((state) =>
      state.activeOrder ? { activeOrder: { ...state.activeOrder, status } } : {}
    );
  },
}));
