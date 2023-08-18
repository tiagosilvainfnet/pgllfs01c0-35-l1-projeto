import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db';

interface ITask{
    id: number;
    title: string;
    description: string;
    status: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TaskCreationAttributes = Optional<ITask, 'id'>;

export class Task extends Model<ITask, TaskCreationAttributes> implements ITask{
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: boolean;
    public userId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'task',
        tableName: 'tasks',
    }
)