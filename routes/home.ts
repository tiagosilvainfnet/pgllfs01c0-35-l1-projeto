import * as express from "express";
import FriendController from "../controllers/FriendController";

const home = express.Router();
const friendCtrl = new FriendController();
// const notificationCtrl = new NotificationController();

home.get('/', async (req, res) => {
    res.render('home')
});

home.get('/search', async (req, res) => {
    const result = await friendCtrl.searchFriend(req.query.q?.toString() || '');
    res.json(result)
});

home.get('/notifications', async (req, res) => {
    // const result = await notificationCtrl.getNotifications(Number(req.query.user_id));
    res.json({})
});


export default home;