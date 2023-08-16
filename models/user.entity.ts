import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface IUser{
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserCreationAttributes = Optional<IUser, 'id'>;

export class User extends Model<IUser, UserCreationAttributes> {
    declare id: number | null;
    declare name: string | null;
    declare email: string | null;
    declare username: string | null;
    declare password: string | null;
    declare createdAt: Date | null;
    declare updatedAt: Date | null;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(70),
            allowNull: false,
            unique: true
        },
        username: {
            type: new DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        password: {
            type: new DataTypes.STRING(256),
            allowNull: false
        },
        createdAt: {
            type: new DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        updatedAt: {
            type: new DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'user',
    }
)