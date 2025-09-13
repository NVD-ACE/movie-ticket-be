import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Room = sequelize.define(
  "Room",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cinemas",
        key: "id",
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
    underscored: true,
  }
);
