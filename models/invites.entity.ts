import { model, Schema } from 'mongoose';

export interface IInvite {
    user_sender: number;
    user_receptor: number;
    status: boolean;
    created_at: Date;
}

export const InviteSchema = new Schema<IInvite>(
    {
        user_sender: { type: 'number', required: true },
        user_receptor: { type: 'number', required: true },
        status: { type: 'boolean', required: true, default: true },
        created_at: { type: Date, default: Date.now }
    },
    { timestamps: true}
);

export const Invite = model<IInvite>('invite', InviteSchema, 'invite')