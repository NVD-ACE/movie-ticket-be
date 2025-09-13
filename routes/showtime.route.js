import express from "express";
import { createShowtime, getAllShowtimes, getShowtimeById, getShowtimesByMovie, getShowtimesByRoom, getShowtimesByCinema, updateShowtime, deleteShowtime } from "../controllers/showtime.controller.js";

const showtimeRoute = express.Router();
showtimeRoute.post("/", createShowtime);
showtimeRoute.get("/", getAllShowtimes);
showtimeRoute.get("/:id", getShowtimeById);
showtimeRoute.get("/movie/:movieId", getShowtimesByMovie);
showtimeRoute.get("/room/:roomId", getShowtimesByRoom);
showtimeRoute.get("/cinema/:cinemaId", getShowtimesByCinema);
showtimeRoute.put("/:id", updateShowtime);
showtimeRoute.delete("/:id", deleteShowtime);
export default showtimeRoute;