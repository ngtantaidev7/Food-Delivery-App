import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { ChatMessage } from '@/types/chat';

const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
const SOCKET_URL =
  (Constants.expoConfig?.extra?.apiUrl as string)?.replace('/api', '') ||
  (hostUri ? `http://${hostUri}:5000` : 'http://localhost:5000');

interface ChatState {
  socket: Socket | null;
  messages: ChatMessage[];
  orderId: string | null;
  isConnected: boolean;
  // Actions
  connect: (orderId: string) => void;
  disconnect: () => void;
  sendMessage: (params: {
    senderId: string;
    receiverId: string;
    text?: string;
    attachmentUrl?: string;
  }) => void;
  setMessages: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  orderId: null,
  isConnected: false,

  connect: (orderId) => {
    const existing = get().socket;
    if (existing?.connected && get().orderId === orderId) return;

    // Clean up previous socket if any
    existing?.disconnect();

    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('join_order_room', orderId);
    });

    socket.on('receive_message', (message: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    set({ socket, orderId, messages: [] });
  },

  disconnect: () => {
    const { socket, orderId } = get();
    if (socket) {
      socket.emit('leave_order_room', orderId);
      socket.disconnect();
    }
    set({ socket: null, orderId: null, messages: [], isConnected: false });
  },

  sendMessage: ({ senderId, receiverId, text, attachmentUrl }) => {
    const { socket, orderId } = get();
    if (!socket?.connected || !orderId) return;
    socket.emit('send_message', { orderId, senderId, receiverId, text, attachmentUrl });
  },

  setMessages: (messages) => set({ messages }),
}));
