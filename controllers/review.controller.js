import { Review } from "../models/review.model.js";


export const createReview = async (req, res) => {
  const { userId, movieId, rating, comment, bookingId } = req.body;

  try {
    const review = await Review.create({
      userId,
      movieId,
      rating,
      comment,
      bookingId,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getReviewsByMovieId = async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { movieId } });
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this movie" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};