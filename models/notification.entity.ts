import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface INotification{
    id: number;
    type: string;
    user_sender?: number;
    user_receptor?: number;
    status?: number;
    created_at?: Date;
    updatedAt?: Date;
}

export type NotificationCreationAttributes = Optional<INotification, 'id'>;

export class Notification extends Model<INotification, NotificationCreationAttributes> {
    declare id: number | null;
    declare type: string | null;
    declare user_sender: number | null;
    declare user_receptor: number | null;
    declare status: number | null;
    declare created_at: Date | null;
    declare updatedAt: Date | null;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_sender: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
        },
        user_receptor: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
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
        tableName: 'notification',
        modelName: 'notifications',
    }
)