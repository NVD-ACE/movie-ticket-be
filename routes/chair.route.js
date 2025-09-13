import { createChair, updateChair, deleteChair, getChairsByRoom, getChairById} from "../controllers/chair.controller.js";
import express from "express";

const chairRouter = express.Router();

chairRouter.post("/", createChair);
chairRouter.get("/room/:roomId", getChairsByRoom);
chairRouter.get("/:chairId", getChairById);
chairRouter.put("/:chairId", updateChair);
chairRouter.delete("/:chairId", deleteChair);

export default chairRouter;
