import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";
export const Category = sequelize.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
});