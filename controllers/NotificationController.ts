import { Notification } from "../models/notification.entity";

export default class NotificationController{
    async saveNotification(type: string, user_sender: Number, user_receptor: Number){
        await Notification.create({
            type: type,
            user_sender: Number(user_sender),
            user_receptor: Number(user_receptor)
        })
    }

    async getNotifications(user_receptor: Number){
        const notifications = await Notification.findAll({
            where: {
                user_receptor: Number(user_receptor),
                status: 0
            }
        })
        return {
            status: 200,
            notifications: notifications
        };
    }

    async updateNotification(status: Number, type: string, user_sender: Number, user_receptor: Number){
        console.log(status, type, user_sender, user_receptor)

        await Notification.update({
            status: Number(status)
        }, {
            where: {
                type: type,
                user_sender: Number(user_sender),
                user_receptor: Number(user_receptor)
            }
        })


        return {
            status: 200,
            result: {}
        }
    }
}