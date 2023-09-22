import * as express from "express";
import FriendController from "../controllers/FriendController";

const friends = express.Router();
const friendCtrl = new FriendController();

friends.get('/', async (req, res) => {
    const result = await friendCtrl.getFriends(Number(req.query.user_id));
    res.statusCode = result.status;
    res.json(result);
});

export default friends;