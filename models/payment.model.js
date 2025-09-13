import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Payment = sequelize.define(
  "Payment",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "payment_methods",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
      allowNull: false,
    },
    paymentTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    underscored: true,
  }
);
