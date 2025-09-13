import {Router} from "express";
import { getMovies, createMovie, updateMovie, deleteMovie, getMovieById, searchMovies } from "../controllers/movie.controller.js";


const movieRoute = Router();
movieRoute.get("/", getMovies);
movieRoute.get("/:id", getMovieById);
movieRoute.get("/search", searchMovies);
movieRoute.post("/", createMovie);
movieRoute.put("/:id", updateMovie);
movieRoute.delete("/:id", deleteMovie);

export default movieRoute;
