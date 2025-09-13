import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";
import { Category } from "./category.model.js";
export const Movie = sequelize.define("Movie", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
    },
    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    director: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cast: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // one image for poster
    posterUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'movies',
    timestamps: true,
    underscored: true,
});