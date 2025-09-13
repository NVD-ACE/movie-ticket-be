import express from "express";
import { getCinemas, createCinema, updateCinema, deleteCinema, getCinemaById, searchCinemasByName } from "../controllers/cinema.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
const cinemaRoute = express.Router();

cinemaRoute.get("/", getCinemas);
cinemaRoute.get("/:id", getCinemaById);
cinemaRoute.get("/search", searchCinemasByName);
cinemaRoute.post("/", authorize, createCinema);
cinemaRoute.put("/:id", authorize, updateCinema);
cinemaRoute.delete("/:id", authorize, deleteCinema);

export default cinemaRoute;
