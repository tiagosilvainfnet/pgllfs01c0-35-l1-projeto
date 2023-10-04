import { model, Schema } from 'mongoose';

export interface IPost {
    user_id: number;
    message: string;
    image: string;
    created_at: Date;
}

export const PostSchema = new Schema<IPost>(
    {
        user_id: { type: 'number', required: true },
        message: { type: String, required: false },
        image: { type: String, required: false },
        created_at: { type: Date, default: Date.now }
    },
    { timestamps: true}
);

export const Post = model<IPost>('post', PostSchema, 'post')