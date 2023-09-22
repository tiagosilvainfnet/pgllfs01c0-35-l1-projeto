import { Friend } from "../models/friend.entity";
import { User } from "../models/user.entity";

export default class FriendController{
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