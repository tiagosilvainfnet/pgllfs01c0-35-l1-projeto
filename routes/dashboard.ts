import * as express from "express";
import moment from "moment";
import TaskController from "../controllers/TaskController";

const dashboard = express.Router();

const taskCtrl = new TaskController();

dashboard.get('/users', async (req, res) => {
    const labels: any[] = [];
    res.json({
        labels,
        dataset: [
            {
                label: "Usuários",
                data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                backgroundColor: "#ff0000",
                borderColor: "#ff0000",
                fill: false,
            }
        ]
    });
});

dashboard.get('/tasks', async (req, res) => {
    const result: object = await taskCtrl.getData();
    res.json(result);
});

export default dashboard;