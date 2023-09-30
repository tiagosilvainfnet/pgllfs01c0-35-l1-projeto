import * as express from "express";
import FriendController from "../controllers/FriendController";
import NotificationController from "../controllers/NotificationController";
import PostController from "../controllers/PostController";

const home = express.Router();
const friendCtrl = new FriendController();
const notificationCtrl = new NotificationController();
const postCtrl = new PostController();

home.get('/', async (req, res) => {
    res.render('home')
});

home.get('/search', async (req, res) => {
    const result = await friendCtrl.searchFriend(req.query.q?.toString() || '', Number(req.query.id || 0));
    res.json(result)
});

home.get('/notifications', async (req, res) => {
    const result = await notificationCtrl.getNotifications(Number(req.query.user_id));
    res.json(result)
});

home.patch('/notifications', async (req, res) => {
    const result = await notificationCtrl.updateNotification(req.body.status, req.body.type, req.body.user_sender, req.body.user_receptor);
    res.json(result)
});

home.get('/posts', async (req, res) => {
    const result = await postCtrl.listPost(Number(req.query.user_id));
    res.json(result)
});

export default home;