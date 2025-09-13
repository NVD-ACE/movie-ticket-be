import { Room } from "../models/room.model.js";
import { Op } from "sequelize";
const createRoom = async (req, res) => {
    const { name, cinemaId, capacity } = req.body;
    if (!name || !cinemaId || !capacity) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Validate capacity is a number
        if (typeof capacity !== 'number' || capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be a positive number" });
        }

        // Check if room with the same name and cinemaId already exists
        const existingRoom = await Room.findOne({ where: { name, cinemaId } });
        if (existingRoom) {
            return res.status(400).json({ message: "Room with this name already exists in the specified cinema" });
        }
        const room = await Room.create({ name, cinemaId, capacity });
        res.status(201).json(room);
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// const getRooms = async (req, res) => {
//     try {
//         const rooms = await Room.findAll();
//         res.status(200).json(rooms);
//     } catch (error) {
//         console.error("Error fetching rooms:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }
const getRooms = async (req, res) => {
    try {
        // Lấy parameters cho phân trang từ query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Validate page và limit
        if (page < 1) {
            return res.status(400).json({ message: "Page must be greater than 0" });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" });
        }

        // Lấy dữ liệu với phân trang
        const { count, rows } = await Room.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']] // Sắp xếp theo thời gian tạo mới nhất
        });

        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            rooms: rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            }
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room);
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { name, cinemaId, capacity } = req.body;
    try {
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        // Validate input
        if (!name || !cinemaId || !capacity) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingRoom = await Room.findOne({ where: { name, cinemaId, id: { [Op.ne]: id } } });
        if (existingRoom) {
            return res.status(409).json({ message: "Room already exists" });
        }
        room.name = name || room.name;
        room.cinemaId = cinemaId || room.cinemaId;
        if (capacity) {
            // Validate capacity is a number
            if (typeof capacity !== 'number' || capacity <= 0) {
                return res.status(400).json({ message: "Capacity must be a positive number" });
            }
            room.capacity = capacity;
        }
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        await room.destroy();
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom
};