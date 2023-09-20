import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface IFriend{
    id: number;
    user_id: number;
    friend_id?: number;
}

export type FriendCreationAttributes = Optional<IFriend, 'id'>;

export class Friend extends Model<IFriend, FriendCreationAttributes> {
    declare id: number | null;
    declare user_id: number | null;
    declare friend_id: number | null;
}

Friend.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
        },
        friend_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'friend',
        modelName: 'friends',
    }
)