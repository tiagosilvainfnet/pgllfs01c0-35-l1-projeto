import { model, Schema } from 'mongoose';

export interface IChat {
    user_sender: number;
    user_receptor: number;
    message: string;
    created_at: Date;
}

export const ChatSchema = new Schema<IChat>(
    {
        user_sender: { type: 'number', required: true },
        user_receptor: { type: 'number', required: true },
        message: { type: String, required: true },
        created_at: { type: Date, default: Date.now }
    },
    { timestamps: true}
);

export const Chat = model<IChat>('chat', ChatSchema, 'chat')