import { Showtime } from "../models/showtime.model.js";
import {Room} from "../models/room.model.js";
import {Cinema} from "../models/cinema.model.js";
const createShowtime = async (req, res) => {
  try {
    const { movieId, roomId, startTime, endTime, cinemaId, date } = req.body;
  // Validate required fields
  if (!movieId) {
    return res.status(400).json({ message: "MovieId is required" });
  }
  if (!roomId) {
    return res.status(400).json({ message: "RoomId is required" });
  }
  if (!startTime) {
    return res.status(400).json({ message: "StartTime is required" });
  }
  if (!endTime) {
    return res.status(400).json({ message: "EndTime is required" });
  }
  if (!cinemaId) {
    return res.status(400).json({ message: "CinemaId is required" });
  }
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }
    // Check if the room and cinema exist
    const room = await Room.findOne({
      where: { id: roomId },
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const cinema = await Cinema.findOne({
      where: { id: cinemaId },
    });
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Create the showtime
    const existingShowtime = await Showtime.findOne({
      where: {
        movieId,
        roomId,
        time_start: startTime,
        time_end: endTime,
        cinemaId,
        date,
      },
    });
    if (existingShowtime) {
      return res
        .status(400)
        .json({
          message:
            "Showtime already exists for this movie in the specified room and time.",
        });
    }
    // Create the new showtime
    const showtime = await Showtime.create({
      movieId,
      roomId,
      time_start: startTime,
      time_end: endTime,
      cinemaId,
      date,
    });
    res.status(201).json(showtime);
  } catch (error) {
    console.error("Error creating showtime:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.findAll({
      order: [["date", "ASC"]],
      include: ["movie", "room", "cinema"],
    });
    res.status(200).json(
        {
            success: true,
            showtimes: showtimes,
            message: "Showtimes fetched successfully"
        }
    );
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getShowtimeById = async (req, res) => {
  const { id } = req.params;
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json(showtime);
  } catch (error) {
    console.error("Error fetching showtime:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getShowtimesByMovie = async (req, res) => {
  const { movieId } = req.params;
  try {
    const showtimes = await Showtime.findAll({
      where: { movieId },
      order: [["date", "ASC"]],
      include: ["room"], // Assuming you have associations set up
    });
    res.status(200).json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes by movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getShowtimesByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const showtimes = await Showtime.findAll({
      where: { roomId },
      order: [["date", "ASC"]],
      include: ["movie"], // Assuming you have associations set up
    });
    res.status(200).json({
        success: true,
        showtimes: showtimes,
        message: "Showtimes fetched successfully for room"
    });
  } catch (error) {
    console.error("Error fetching showtimes by room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getShowtimesByCinema = async (req, res) => {
  const { cinemaId } = req.params;
  try {
    const showtimes = await Showtime.findAll({
      where: { cinemaId },
      order: [["date", "ASC"]],
      include: ["movie", "room"],
    });
    res.status(200).json({
        success: true,
        showtimes: showtimes,
        message: "Showtimes fetched successfully for cinema"
    });
  } catch (error) {
    console.error("Error fetching showtimes by cinema:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateShowtime = async (req, res) => {
  const { id } = req.params;
  const { movieId, roomId, startTime, endTime, date, cinemaId } = req.body;
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    showtime.movieId = movieId || showtime.movieId;
    showtime.roomId = roomId || showtime.roomId;
    showtime.startTime = startTime || showtime.startTime;
    showtime.endTime = endTime || showtime.endTime;
    showtime.date = date || showtime.date;
    showtime.cinemaId = cinemaId || showtime.cinemaId;
    await showtime.save();
    res.status(200).json(showtime);
  } catch (error) {
    console.error("Error updating showtime:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteShowtime = async (req, res) => {
  const { id } = req.params;
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    await showtime.destroy();
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    console.error("Error deleting showtime:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovie,
  getShowtimesByRoom,
  getShowtimesByCinema,
  updateShowtime,
  deleteShowtime,
};
