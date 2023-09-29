import { Friend } from "../models/friend.entity";
import { User } from "../models/user.entity";
import { Invite } from "../models/invites.entity";
import { Op } from "sequelize";

export default class FriendController{
    async sendInvite(data: any){
        Invite.create({
            user_sender: data.user_id,
            user_receptor: data.friend_id,
            status: 0
        });

        return {
            status: 200,
            result: {}
        }
    }

    async responseInvite(data: any){
        if(data.status === 1){
            Friend.create({
                user_id: data.user_id,
                friend_id: data.friend_id
            })
            Friend.create({
                user_id: data.friend_id,
                friend_id: data.user_id
            })
        }else{
            Invite.deleteOne({
                where: {
                    user_sender: data.user_id,
                    user_receptor: data.friend_id
                }
            })
        }

        return {
            status: 200,
            result: {}
        }
    }

    async searchFriend(query: String){
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${query}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${query}%`
                        }
                    }
                ]
            }
        })

        const usersObj: Array<Object> = []

        for(const user of users){
            usersObj.push({
                name: user.name,
                email: user.email,
                id: user.id,
            });
        }

        return {
            status: 200,
            result: usersObj
        }
    }

    async getFriend(id: Number){
        const user = await User.findOne({
            where: {
                id: Number(id)
            }
        })  
        
        return {
            status: 200,
            result: user
        }
    }


    async getFriends(id: Number){
        const friends = await Friend.findAll({
            where: {
                user_id: Number(id)
            }
        })

        const friendsObj: Array<Object> = []

        for(const friend of friends){
            const user = await User.findOne({
                where: {
                    id: Number(friend.friend_id)
                }
            })
            if(user){
                friendsObj.push({
                    name: user.name,
                    email: user.email,
                    id: user.id,
                });
            }
        }

        return {
            status: 200,
            result: friendsObj
        }
    }
}