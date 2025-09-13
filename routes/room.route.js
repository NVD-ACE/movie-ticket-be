import express from "express";
import { getRooms, createRoom, updateRoom, deleteRoom, getRoomById } from "../controllers/room.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
const roomRoute = express.Router();

roomRoute.get("/", getRooms);
roomRoute.post("/", authorize, createRoom);
roomRoute.get("/:id", getRoomById);
roomRoute.put("/:id", authorize, updateRoom);
roomRoute.delete("/:id", authorize, deleteRoom);

export default roomRoute;
