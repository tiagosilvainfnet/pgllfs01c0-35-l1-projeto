import * as express from "express";
import FriendController from "../controllers/FriendController";

const friends = express.Router();
const friendCtrl = new FriendController();

friends.get('/', async (req, res) => {
    const result = await friendCtrl.getFriends(Number(req.query.user_id));
    res.statusCode = result.status;
    res.json(result);
});

friends.get('/user', async (req, res) => {
    const result = await friendCtrl.getFriend(Number(req.query.id));
    res.statusCode = result.status;
    res.json(result);
});

friends.post('/send-invite', async (req, res) => {
    const result = await friendCtrl.sendInvite(req.body);
    res.statusCode = result.status;
    res.json(result);
})

friends.post('/response-invite', async (req, res) => {
    const result = await friendCtrl.responseInvite(req.body);
    res.statusCode = result.status;
    res.json(result);
})

export default friends;