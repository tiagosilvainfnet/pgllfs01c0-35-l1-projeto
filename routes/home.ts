import * as express from "express";

const home = express.Router();

home.get('/', async (req, res) => {
    res.render('home')
});


export default home;