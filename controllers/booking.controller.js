import { Booking } from "../models/booking.model.js";
import { Chair } from "../models/chair.model.js";
import { Op } from "sequelize";
import { BookingChair } from "../models/bookingChair.model.js";
import { sequelize } from "../models/index.js";
export const bookTickets = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, paymentMethodId, showTimeId, chairIds = [] } = req.body;

    // Validate input
    if (!userId || !paymentMethodId || !showTimeId || !chairIds) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const chairs = await Chair.findAll({
      where: {
        id: { [Op.in]: chairIds },
        isActive: false,
      },
    });
    if (chairs.length !== chairIds.length) {
      return res
        .status(404)
        .json({ error: "Some chairs not found or inactive" });
    }
    const existingBookingChairs = await BookingChair.findAll({
      include: [
        {
          model: Booking,
          where: { showTimeId },
          attributes: [],
        },
      ],
      where: {
        chairId: { [Op.in]: chairIds },
      },
      transaction,
    });
    if (existingBookingChairs.length > 0) {
      return res.status(409).json({ error: "Some chairs are already booked" });
    }
    const totalPrice = chairs.reduce((sum, chair) => sum + chair.price, 0);
    // Create booking
    const booking = await Booking.create({
      userId,
      paymentMethodId,
      showTimeId,
      totalPrice,
    });
    const bookingChairsData = chairIds.map((chairId) => ({
      bookingId: booking.id,
      chairId,
    }));
    await BookingChair.bulkCreate(bookingChairsData, { transaction });
    await Chair.update(
      { isActive: true },
      {
        where: { id: { [Op.in]: chairIds } },
        transaction,
      }
    );
    await transaction.commit();
    res.status(201).json(booking);
  } catch (error) {
    {
      await transaction.rollback();
      console.error("Error booking tickets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
// export const getBookingsByUser = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const bookings = await Booking.findAll({
//       where: { userId },
//     });
//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings by user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await Booking.findAndCountAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Chair,
          through: { attributes: [] },
          attributes: ["id", "seatNumber", "type", "price"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách booking của user thành công",
      data: {
        bookings: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error in getBookingsByUser:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy booking của user",
      error: error.message,
    });
  }
};
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Chair,
          through: { attributes: [] },
          attributes: ["id", "seatNumber", "type", "price"],
        },
      ],
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
    
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy booking theo ID",
      error: error.message,
    });
  }
}
export const updateBooking = async (req, res) => {
  try {
   const { bookingId } = req.params;
    const { chairIds } = req.body;
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Chair,
          through: { attributes: [] },
          attributes: ["id", "seatNumber", "type", "price"],
        },
      ],
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (chairIds && chairIds.length > 0) {
      const chairs = await Chair.findAll({
        where: {
          id: { [Op.in]: chairIds },
          isActive: true,
        },
      });
      if (chairs.length !== chairIds.length) {
        return res
          .status(404)
          .json({ error: "Some chairs not found or inactive" });
      }
      const bookingChairsData = chairIds.map((chairId) => ({
        bookingId: booking.id,
        chairId,
      }));
      await BookingChair.bulkCreate(bookingChairsData, { ignoreDuplicates: true });
    }
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const bookingChairs = await BookingChair.findAll({
      where: { bookingId: id },
    });
    for (const bookingChair of bookingChairs) {
      await Chair.update(
        { isActive: false },
        {
          where: { id: bookingChair.chairId },
        }
      );
    }
    await BookingChair.destroy({
      where: { bookingId: id },
    });
    await booking.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Chair,
          through: { attributes: [] },
          attributes: ["id", "seatNumber", "type", "price"],
        },
      ],
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}