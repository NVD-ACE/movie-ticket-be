import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";
import { Movie } from "./movie.model.js";
import { Category } from "./category.model.js";
import { Cinema } from "./cinema.model.js";
import { Room } from "./room.model.js";
import { Chair } from "./chair.model.js";
import { Showtime } from "./showtime.model.js";
import { Ticket } from "./ticket.model.js";
import { Role } from "./role.model.js";
import { Booking } from "./booking.model.js";
import { Payment } from "./payment.model.js";
import { Review } from "./review.model.js";
import { PaymentMethod } from "./paymentMethod.model.js";
import { BookingChair } from "./bookingChair.model.js"; // Assuming you have a BookingChair model for the many-to-many relationship
// Define associations

// Can create associations here or file associations.js
Room.hasMany(Chair, { foreignKey: "roomId", as: "chairs" });
Chair.belongsTo(Room, { foreignKey: "roomId", as: "room" });
Movie.belongsTo(Category, { foreignKey: "categoryId" });
Cinema.hasMany(Room, { foreignKey: "cinemaId" });
Showtime.belongsTo(Cinema, { foreignKey: "cinemaId", as: "cinema" });
Showtime.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });
Showtime.belongsTo(Room, { foreignKey: "roomId", as: "room" });
Room.hasMany(Showtime, { foreignKey: "roomId" });
User.hasMany(Ticket, { foreignKey: "userId" });
Ticket.belongsTo(Chair, { foreignKey: "chairId" });
Showtime.hasMany(Ticket, { foreignKey: "showtimeId" });
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });
Room.belongsTo(Cinema, { foreignKey: "cinemaId" });
Cinema.hasMany(Room, { foreignKey: "cinemaId" });
Booking.belongsToMany(Chair, {
  through: "BookingChairs",
  foreignKey: "bookingId",
});
Chair.belongsToMany(Booking, {
  through: "BookingChairs",
  foreignKey: "chairId",
});
Category.hasMany(Movie, { foreignKey: "categoryId" });
Booking.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasMany(Booking, { foreignKey: "paymentId" });
Booking.belongsTo(Showtime, { foreignKey: "showTimeId" });
Showtime.hasMany(Booking, { foreignKey: "showTimeId" });
Booking.hasMany(Ticket, { foreignKey: "bookingId" });
Ticket.belongsTo(Booking, { foreignKey: "bookingId" });
Payment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Payment, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });
Movie.hasMany(Review, { foreignKey: "movieId" });
Review.belongsTo(Movie, { foreignKey: "movieId" });
Review.belongsTo(Booking, { foreignKey: "bookingId" });
Booking.hasMany(BookingChair, { foreignKey: "bookingId" });
BookingChair.belongsTo(Booking, { foreignKey: "bookingId" });
Ticket.belongsTo(Chair, { foreignKey: "chairId" });
BookingChair.belongsTo(Chair, { foreignKey: "chairId" });

// Sync DB (tạo bảng nếu chưa có)
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

export {
  sequelize,
  User,
  Movie,
  Category,
  Cinema,
  Room,
  Chair,
  Showtime,
  Ticket,
  Role,
  Booking,
  Payment,
  Review,
  PaymentMethod,
  BookingChair,
};
