import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

export const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    // unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  roleId: {
    type: DataTypes.INTEGER,
    defaultValue: 2, // Assuming 2 is the default role ID for users
    allowNull: false,
    references: {
      model: 'roles', // Assuming you have a Roles model
      key: 'id',
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});
