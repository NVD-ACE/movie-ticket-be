import { createReview, deleteReview, getReviewById, getReviewsByMovieId, updateReview } from "../controllers/review.controller.js";
import express from "express";

const reviewRoute = express.Router();
reviewRoute.post("/",createReview);
reviewRoute.get("/movie/:movieId", getReviewsByMovieId);
reviewRoute.get("/:id", getReviewById);
reviewRoute.put("/:id", updateReview);
reviewRoute.delete("/:id", deleteReview);

export default reviewRoute;
