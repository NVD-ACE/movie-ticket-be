import { User } from "../models/index.js";
import bcrypt from "bcryptjs";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const getUsers = async (req, res) => {
  try {
    // Lấy các query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Tính offset cho phân trang
    const offset = (page - 1) * limit;
    
    // Tạo điều kiện tìm kiếm
    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { userName: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Truy vấn với phân trang và tìm kiếm
    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']], // Sắp xếp theo ngày tạo mới nhất
      attributes: { exclude: ['password'] } // Loại bỏ password khỏi response
    });
    
    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Trả về kết quả
    res.json({
      users: rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalUsers: count,
        limit: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      },
      search: search
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, fullname, profilePicture, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.userName = username;
    user.email = email;
    user.fullName = fullname;
    user.profilePicture = profilePicture || user.profilePicture;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.updatedAt = new Date();
    // If you have a roleId, you can also update it here
    if (req.body.roleId) {
      user.roleId = req.body.roleId;
    }
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Prevent deletion of admin user
    // Assuming roleId 1 is for admin
    if (user.roleId === 1) {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}