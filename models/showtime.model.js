import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const Showtime = sequelize.define("Showtime", {
    date: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: false,
    },
    time_start: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: false,
    },
    time_end: {
        // type: DataTypes.DATE,
        type: DataTypes.STRING,
        allowNull: false,
    },
    cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cinemas',
            key: 'id',
        },
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'movies',
            key: 'id',
        },
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'id',
        },
    },
}, {
    tableName: 'showtimes',
    timestamps: true,
    underscored: true,
});