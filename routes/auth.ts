import * as express from "express";
import { User } from "../models";
import bcrypt from "bcrypt";

const auth = express.Router();

auth.get('/login', async (req, res) => {
    res.render('login')
});

auth.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user) {
        const verifica = await bcrypt.compare(password, user.getDataValue('password'));
        if(verifica){
            res.status(200)
            // res.send(user)
        }
        res.status(405)
    }
    res.status(405)
    
});


export default auth;