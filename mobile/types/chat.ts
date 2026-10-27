export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: 'customer' | 'driver';
  text?: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}
