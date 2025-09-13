import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const Cinema = sequelize.define("Cinema", {
    name: {
        type: DataTypes.STRING,

        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'cinemas',
    timestamps: true,
    underscored: true,
}); 