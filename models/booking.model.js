import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const Booking = sequelize.define(
  "Booking",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "payment_methods",
        key: "id",
      },
    },
    showTimeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "showtimes",
        key: "id",
      },
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    underscored: true,
    hooks: {
      // Tự động tính tổng tiền từ tickets
      beforeSave: async (booking, options) => {
        if (booking.changed("totalPrice") === false) {
          const tickets = await sequelize.models.Ticket.findAll({
            where: { bookingId: booking.id },
          });
          booking.totalPrice = tickets.reduce(
            (sum, ticket) => sum + ticket.price,
            0
          );
        }
      },
    },
  }
);
