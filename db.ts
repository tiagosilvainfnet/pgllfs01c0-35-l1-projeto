import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

require('dotenv').config();

const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    dialect: 'mysql',
});

mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`)
const mongoDb = mongoose.connection;

export  {
    sequelize,
    mongoDb
}