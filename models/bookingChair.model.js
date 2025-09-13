import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const BookingChair = sequelize.define(
    "BookingChair",
    {
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "bookings",
                key: "id",
            },
        },
        chairId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "chairs",
                key: "id",
            },
        },
    },
    {
        tableName: "booking_chairs",
        timestamps: false,
    }
);
