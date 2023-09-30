// @ts-nocheck
import AdminJS, { useCurrentAdmin } from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import session from 'express-session';
import * as AdminJSSequelize from '@adminjs/sequelize'
import * as AdminJSMongoose from '@adminjs/mongoose'
import { SocketDataChat } from './interfaces/SocketInterface';

import { Task, User, Friend } from './models';
import { generateResource } from './utils/modeling-model';
import { encryptPassword } from './utils/user-utils';
import { sequelize } from './db';
import bcrypt from "bcrypt";
import hbs from 'hbs';
import Mail from './utils/Mail';
import dashboard from './routes/dashboard';
import home from './routes/home';
import auth from './routes/auth';
import chat from './routes/chat';
import http from 'http';
import { Server } from "socket.io";
import ChatController from './controllers/ChatController';
import friends from './routes/friends';
import NotificationController from './controllers/NotificationController';

import { Chat } from './models/chat.entity';
import { Notification } from './models/notification.entity';
import { Post } from './models/post.entity';
import PostController from './controllers/PostController';

const notificatioCtrl = new NotificationController();
const postCtrl = new PostController();

const path = require('node:path');
const mysqlStore = require('express-mysql-session')(session);
require('dotenv').config();

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource, 
  Database: AdminJSMongoose.Database
});

const bodyParser = require('body-parser');
const PORT = 3000
const ROOT_DIR = __dirname;
const chatCtrl = new ChatController();

const email = new Mail(ROOT_DIR);

const start = async () => {
  const app = express()
  const server = http.createServer(app);
  const io = new Server<SocketDataChat>(server);

  sequelize.sync().then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });

  const admin = new AdminJS({
    resources: [
      generateResource(User, {
        password: {
          type: 'password',
          isVisible: {
            add: true, list: false, edit: true, filter: false, show: false
          }
        }
      }, {
        new: {
          before: async (request: any) => {
            await email.sendEmail(request.payload.email, 'Bem vindo ao meu gestor de tarefas', 'password-send', { text: "seja, bem-vindo ao sistema, sua senha é:", name: request.payload.name, password: request.payload.password });

            return encryptPassword(request);
          }
        },
        edit: {
          before: async (request: any, context: any) => {
            if (request.method !== 'post') return request

            if(request.payload.password !== context.record.params.password){
              await email.sendEmail(request.payload.email, 'Alteração de senha', 'password-send', { text: "sua senha sofreu alteração e agora ela é:", name: request.payload.name, password: request.payload.password });
              return encryptPassword(request);
            }
            return request
          }
        },
      }),
      generateResource(Task),
      generateResource(Chat),
      generateResource(Friend),
      generateResource(Notification),
      generateResource(Post),
    ],
    rootPath: '/admin',
    dashboard: {
      component: AdminJS.bundle('./components/dashboard.jsx'),
    },
    branding: {
      favicon: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
      logo: "https://t4.ftcdn.net/jpg/05/06/81/59/360_F_506815935_cvsf1tKw8WuPeHpHSm2efPbbH08Tw8nN.png",
      companyName: "Meu gestor de tarefas"
    }
  })

  const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
  })

  const secret = 'tsiVAtrIm9w6brtVZ7LhheemelWsTWU2';
  const cookieName = 'adminjs';
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email: string, password: string) => {
        const user = await User.findOne({ where: { email } });
        if (user) {
          const verifica = await bcrypt.compare(password, user.getDataValue('password'));
          if(verifica){
            return user;
          }
          return false;
        }
        return false;
      },
      cookieName: cookieName,
      cookiePassword: secret
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: secret,
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production'
      },
      name: cookieName
    }
  )
  hbs.registerPartials(path.join(ROOT_DIR, 'views'));
  app.set('view engine', '.hbs');
  app.use(express.static('public'));
  app.use(admin.options.rootPath, adminRouter)
  app.use(express.json())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/dashboard', dashboard);
  app.use('/', auth);
  app.use('/', home);
  app.use('/chat', chat);
  app.use('/friends', friends);

  io.on('connection', (socket) => {
    console.log("Usuário se conectou.")

    socket.on('SEND_MESSAGE', (data) => {
      const { message, user_sender, user_receptor } = data;
      chatCtrl.sendMessage(message, user_sender, user_receptor)
      notificatioCtrl.saveNotification('chat', user_sender, user_receptor);

      io.emit('RECEIVE_MESSAGE', data)
      io.emit('RECEIVE_NOTIFICATION', {
        user_sender: user_sender,
        user_receptor: user_receptor,
        type: 'chat'
      })
    })

    socket.on('SEND_NOTIFICATION', (data) => {
      notificatioCtrl.saveNotification(data.type, data.user_id, data.friend_id);

      io.emit('RECEIVE_NOTIFICATION', {
        user_sender: data.user_id,
        user_receptor: data.friend_id,
        type: data.type
      })
    })

    socket.on('SEND_POST', (data) => {
      postCtrl.savePost(data.message, data.user_id);
      io.emit('RECEIVE_POST', {
        message: data.message, 
        user_id: data.user_id
      })
    })

    socket.on('SEND_UPDATE_CHAT', (data) => {
      io.emit('RECEIVE_UPDATE_CHAT', {
        user_sender: data.user_id,
        user_receptor: data.friend_id,
      })
    })

    socket.on("disconnect", (reason) => {
      console.log("Desconectou")
    });
  })

  server.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })

  
}

start()