import { Router } from "express";
import { bookTickets, deleteBooking, getAllBookings, getBookingsByUser, updateBooking, getBookingById } from "../controllers/booking.controller.js";

const bookingRoute = Router();
bookingRoute.post("/", bookTickets);
bookingRoute.get("/", getAllBookings);
bookingRoute.get("/:bookingId", getBookingById);
bookingRoute.get("/user/:userId", getBookingsByUser);
bookingRoute.delete("/:bookingId", deleteBooking);
bookingRoute.put("/:bookingId", updateBooking);

export default bookingRoute;
