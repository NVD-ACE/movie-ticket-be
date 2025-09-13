import e from "express";
import { Chair } from "../models/chair.model.js";
import { Room } from "../models/room.model.js";
export const createChair = async (req, res) => {
    try {
        const {seatNumber, roomId, type} = req.body;
        // Validate input
        if (!seatNumber || !roomId || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Check if chair already exists
        const existingChair = await Chair.findOne({ where: { seatNumber, roomId } });
        if (existingChair) {
            return res.status(409).json({ error: "Chair already exists" });
        }
        //check room
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        // Create chair
        const chair = await Chair.create({
            seatNumber,
            roomId,
            type,
        });
        
        res.status(201).json(chair);
    } catch (error) {
        console.error("Error creating chair:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getChairById = async (req, res) => {
    const { chairId } = req.params;
    try {
        const chair = await Chair.findByPk(chairId);
        if (!chair) {
            return res.status(404).json({ error: "Chair not found" });
        }
        res.status(200).json(chair);
    } catch (error) {
        console.error("Error fetching chair by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getChairsByRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const chairs = await Chair.findAll({ where: { roomId } });
        res.status(200).json(chairs);
    } catch (error) {
        console.error("Error fetching chairs by room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const updateChair = async (req, res) => {
    const { chairId } = req.params;
    const { seatNumber, roomId, type, isActive } = req.body;
    try {
        const chair = await Chair.findByPk(chairId);
        if (!chair) {
            return res.status(404).json({ error: "Chair not found" });
        }
        // Update chair details
        chair.seatNumber = seatNumber || chair.seatNumber;
        chair.roomId = roomId || chair.roomId;
        chair.type = type || chair.type;
        chair.isActive = isActive !== undefined ? isActive : chair.isActive; // Allow toggling active status
        await chair.save();
        res.status(200).json(chair);
    } catch (error) {
        console.error("Error updating chair:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const deleteChair = async (req, res) => {
    const { chairId } = req.params;
    try {
        const chair = await Chair.findByPk(chairId);
        if (!chair) {
            return res.status(404).json({ error: "Chair not found" });
        }
        await chair.destroy();
        res.status(204).json({ message: "Chair deleted successfully" });
    } catch (error) {
        console.error("Error deleting chair:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
