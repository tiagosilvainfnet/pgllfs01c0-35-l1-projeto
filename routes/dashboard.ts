import * as express from "express";
import moment from "moment";
import TaskController from "../controllers/TaskController";

const dashboard = express.Router();

const taskCtrl = new TaskController();

dashboard.get('/tasks/months', async (req, res) => {
    const result: object = await taskCtrl.getData();
    res.json(result);
});

dashboard.get('/tasks/months/:month', async (req, res) => {
    const result: object = await taskCtrl.getDataMonth(req.params.month);
    res.json(result);
});


export default dashboard;