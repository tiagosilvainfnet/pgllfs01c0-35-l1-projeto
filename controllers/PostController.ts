import { Friend } from '../models/friend.entity';
import { Post } from '../models/post.entity';

export default class PostController{
    async listPost(user_id: Number){
        const ids = [Number(user_id)]
        const friends = await Friend.findAll({
            where: {
                user_id: Number(user_id)
            }
        })
        if(friends.length > 0){
            friends.forEach((friend) => {
                ids.push(Number(friend.friend_id))
            })
        }

        const posts = await Post.find({user_id: { $in: ids}})

        return {
            status: 200,
            posts: posts
        }
    }

    savePost(message: string, user_id: Number, image: string){
        Post.create({
            message: message,
            user_id: Number(user_id),
            image: image
        })

        return {
            status: 200,
            result: {}
        }
    }
}