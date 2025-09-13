import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Chair = sequelize.define(
  "Chair",
  {
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rooms",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("regular", "vip", "couple"),
      allowNull: false,
      defaultValue: "regular", 
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100000,
    },
  },
  {
    tableName: "chairs",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (chair) => {
        switch (chair.type) {
          case "vip":
            chair.price = 150000;
            break;
          case "couple":
            chair.price = 200000;
            break;
          case "regular":
          default:
            chair.price = 100000;
        }
      },
      beforeUpdate: (chair) => {
        switch (chair.type) {
          case "vip":
            chair.price = 150000;
            break;
          case "couple":
            chair.price = 200000;
            break;
          case "regular":
          default:
            chair.price = 100000;
        }
      },
    }
  }
);
