import express from "express";
import cors from "cors";
import {connectionSeq} from "./config/database.js";
import dotenv from "dotenv"
import CookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import movieRoute from "./routes/movie.route.js";
import categoryRoute from "./routes/category.route.js";
import roomRoute from "./routes/room.route.js";
import cinemaRoute from "./routes/cinema.route.js";
import chairRoute from "./routes/chair.route.js";
import showtimeRoute from "./routes/showtime.route.js";
import ticketRoute from "./routes/ticket.route.js";
import paymentRoute from "./routes/payment.route.js";
import bookingRoute from "./routes/booking.route.js";
import reviewRoute from "./routes/review.route.js";
dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(CookieParser());

app.use("/api/v1/users", userRoute)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/movies", movieRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/rooms", roomRoute);
app.use("/api/v1/cinemas", cinemaRoute);
app.use("/api/v1/chairs", chairRoute);
app.use("/api/v1/showtimes", showtimeRoute);
app.use("/api/v1/tickets", ticketRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/reviews", reviewRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectionSeq();  
  console.log(`Server running on http://localhost:${PORT}`);
});
