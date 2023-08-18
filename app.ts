import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import session from 'express-session';
import * as AdminJSSequelize from '@adminjs/sequelize'
import { Task, User } from './models';
import { generateResource } from './utils/modeling-model';
import { encryptPassword } from './utils/user-utils';
import { sequelize } from './db';

const mysqlStore = require('express-mysql-session')(session);
require('dotenv').config();

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const PORT = 3000

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
            return encryptPassword(request);
          }
        },
        edit: {
          before: async (request: any) => {
            return encryptPassword(request);
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
      authenticate: async (email: string) => {
        const user = await User.findOne({ where: { email } });

        if (user) {
          return user;
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
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })
}

start()