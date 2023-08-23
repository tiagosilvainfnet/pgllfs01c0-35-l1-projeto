import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import session from 'express-session';
import * as AdminJSSequelize from '@adminjs/sequelize'
import { Task, User } from './models';
import { generateResource } from './utils/modeling-model';
import { encryptPassword } from './utils/user-utils';
import { sequelize } from './db';
import bcrypt from "bcrypt";
import hbs from 'hbs';
import Mail from './utils/Mail';
import dashboard from './routes/dashboard';

const path = require('node:path');
const mysqlStore = require('express-mysql-session')(session);
require('dotenv').config();

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const bodyParser = require('body-parser');
const PORT = 3000
const ROOT_DIR = __dirname;

const email = new Mail(ROOT_DIR);

const start = async () => {
  const app = express()
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
      generateResource(Task)
    ],
    rootPath: '/admin',
    dashboard: {
      component: AdminJS.bundle('./components/dashboard.tsx')
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
  app.use(admin.options.rootPath, adminRouter)
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/dashboard', dashboard);

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })
}

start()