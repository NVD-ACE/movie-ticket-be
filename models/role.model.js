import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Role = sequelize.define(
  "Role",
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
    tableName: "roles",
  }
);
