import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  orderId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  text?: string;
  attachmentUrl?: string; // Supports cutlery / food receipts photos
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    attachmentUrl: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', MessageSchema);
export default Message;
