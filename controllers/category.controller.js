import { Category } from "../models/index.js";
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }
        // Check if category already exists
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        // Create the category
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getCategories = async (req, res) => {
    try {
        // Lấy các query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'DESC';
        
        // Validate limit (tối đa 100 items per page)
        const validLimit = Math.min(limit, 100);
        
        // Tính offset cho phân trang
        const offset = (page - 1) * validLimit;
        
        // Tạo điều kiện tìm kiếm
        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        
        // Validate sortBy field
        const allowedSortFields = ['name', 'description', 'createdAt', 'updatedAt'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
        
        // Truy vấn với phân trang và tìm kiếm
        const { count, rows } = await Category.findAndCountAll({
            where: whereCondition,
            limit: validLimit,
            offset: offset,
            order: [[validSortBy, validSortOrder]],
            distinct: true
        });
        
        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(count / validLimit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        // Trả về kết quả
        res.status(200).json({
            categories: rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalCategories: count,
                limit: validLimit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            },
            search: search,
            sort: {
                sortBy: validSortBy,
                sortOrder: validSortOrder
            }
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// const getCategories = async (req, res) => {
//     try {
//         const categories = await Category.findAll();
//         res.status(200).json(categories);
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.status(200).json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};