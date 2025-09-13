import {Cinema} from "../models/cinema.model.js";
import {Op} from "sequelize";
const createCinema = async (req, res) => {
    const { name, location, capacity } = req.body;
    if (!name || !location || !capacity) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Validate capacity is a number
    if (typeof capacity !== 'number' || capacity <= 0) {
        return res.status(400).json({ message: "Capacity must be a positive number"
        });
    }
    // Create the cinema
    try {
        // Check if cinema already exists
        const existingCinema = await Cinema.findOne({ where: { name, location } });
        if (existingCinema) {
            return res.status(400).json({ message: "Cinema already exists" });
        }
        // Create the cinema
        const cinema = await Cinema.create({ name, location, capacity });
        res.status(201).json(cinema);
    } catch (error) {
        console.error("Error creating cinema:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// const getCinemas = async (req, res) => {
//     try {
//         const cinemas = await Cinema.findAll();
//         res.status(200).json(cinemas);
//     } catch (error) {
//         console.error("Error fetching cinemas:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }
const getCinemas = async (req, res) => {
    try {
        // Lấy các query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "DESC";

        // Validate page và limit
        if (page < 1) {
            return res.status(400).json({ message: "Page must be greater than 0" });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" });
        }

        // Validate sortOrder
        const validSortOrders = ["ASC", "DESC"];
        if (!validSortOrders.includes(sortOrder.toUpperCase())) {
            return res.status(400).json({ message: "Sort order must be ASC or DESC" });
        }

        // Validate sortBy
        const validSortFields = ["id", "name", "location", "capacity", "createdAt", "updatedAt"];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sort field" });
        }

        const offset = (page - 1) * limit;

        // Tạo điều kiện tìm kiếm
        const whereCondition = search ? {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    location: {
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        } : {};

        // Tìm kiếm với phân trang
        const { count, rows } = await Cinema.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            distinct: true
        });

        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            },
            query: {
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder
            }
        });
    } catch (error) {
        console.error("Error fetching cinemas:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const getCinemaById = async (req, res) => {
    const { id } = req.params;
    try {
        const cinema = await Cinema.findByPk(id);
        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found" });
        }
        res.status(200).json(cinema);
    } catch (error) {
        console.error("Error fetching cinema:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const updateCinema = async (req, res) => {
    const { id } = req.params;
    const { name, location, capacity } = req.body;
    try {
        const cinema = await Cinema.findByPk(id);
        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found" });
        }
        // Validate input
        if (!name && !location && !capacity) {
            return res.status(400).json({ message: "At least one field is required for update" });
        }
        cinema.name = name || cinema.name;
        cinema.location = location || cinema.location;
        const existingCinema = await Cinema.findOne({ where: { name: cinema.name, id: { [Op.ne]: id } } });
        if (existingCinema) {
            return res.status(400).json({ message: "Cinema had created" });
        }
        if (capacity) {
            // Validate capacity is a number
            if (typeof capacity !== 'number' || capacity <= 0) {
                return res.status(400).json({ message: "Capacity must be a positive number" });
            }
            cinema.capacity = capacity;
        }
        await cinema.save();
        res.status(200).json(cinema);
    } catch (error) {
        console.error("Error updating cinema:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const deleteCinema = async (req, res) => {
    const { id } = req.params;
    try {
        const cinema = await Cinema.findByPk(id);
        if (!cinema) {
            return res.status(404).json({ message: "Cinema not found" });
        }
        await cinema.destroy();
        res.status(200).json({ message: "Cinema deleted successfully" });
    } catch (error) {
        console.error("Error deleting cinema:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const searchCinemasByName = async (req, res) => {
    try {
        const { name } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!name) {
            return res.status(400).json({ message: "Name parameter is required" });
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Cinema.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: limit,
            offset: offset,
            order: [['name', 'ASC']]
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            searchQuery: name
        });
    } catch (error) {
        console.error("Error searching cinemas by name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export {
    createCinema,
    getCinemas,
    getCinemaById,
    updateCinema,
    searchCinemasByName,
    deleteCinema
};