import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Ticket = sequelize.define("Ticket", {
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
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Default price for the ticket
  },
}, {
    tableName: 'tickets',
    timestamps: true,
    underscored: true,
    paranoid: true, 
    beforeCreate: async (ticket, options) => {
      const chair = await sequelize.models.Chair.findByPk(ticket.chairId);
      if (chair) {
        ticket.price = chair.price;
      }
    }
});