import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";
import { Booking } from "./booking.model.js";

export const Review = sequelize.define(
  "Review",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "movies",
        key: "id",
      },
    },
    // User must have watched the movie ==> comment
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Booking,
        key: "id",
      },
    },

    // Rating should be between 1 and 5
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    underscored: true,
  }
);
