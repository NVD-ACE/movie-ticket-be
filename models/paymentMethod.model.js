import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PaymentMethod = sequelize.define(
  "PaymentMethod",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payment_methods",
  }
);
