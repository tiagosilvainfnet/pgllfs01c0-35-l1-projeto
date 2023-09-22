import { Chat } from '../models/chat.entity';


export default class ChatController{
    generatePagination(page: number, limit: number){
        const _limit = limit || 10;
        const _page = page || 1;

        return {
            limit: _limit,
            offset: (_page - 1) * _limit    
        }
    }

    async sendMessage(message: string, user_sender: number, user_receptor: number){
        await this.insertMessage(message, user_sender, user_receptor);
    }
    
    async loadMessage(page:number=10, _limit:number=10, user_id:number, user_friend:number){
        const { offset, limit } = this.generatePagination(page, _limit);
        const chat = await Chat.find({
                $or: [
                    { $and: [{user_sender: user_id}, {user_receptor: user_friend}] },
                    { $and: [{user_sender: user_friend}, {user_receptor: user_id}] }
                ]
            }).skip(offset).limit(limit).sort({ created_at: 1 });
        const count = await Chat.countDocuments();
        const total = Math.ceil(count / limit);

        return {
            rows: chat,
            count: count,
            total: total,
            status: 200
        }
    }
    async insertMessage(message: string, user_sender: number, user_receptor: number){
        const chat = new Chat({
            message: message,
            user_sender: user_sender,
            user_receptor: user_receptor
        });
        await chat.save();
    }
}