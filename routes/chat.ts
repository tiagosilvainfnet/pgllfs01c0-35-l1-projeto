import * as express from "express";
import ChatController from "../controllers/ChatController";

const chat = express.Router();
const chatCtrl = new ChatController();

chat.get('/', async (req, res) => {
    const result = await chatCtrl.loadMessage(Number(req.query.page), Number(req.query.limit), Number(req.query.user_id), Number(req.query.friend_id));
    res.statusCode = result.status;
    res.json(result);
});

export default chat;