import { Ticket } from "../models/ticket.model.js";
import { Chair } from "../models/chair.model.js";
import { Booking } from "../models/booking.model.js";
export const createTicket = async (req, res) => {
  const { bookingId, chairId, price } = req.body;
  if (!bookingId || !chairId || !price) {
    return res.status(400).json({
      message: "BookingId, chairId, and price are required",
    });
  }
  const existingTicket = await Ticket.findOne({
    where: { bookingId, chairId },
  });
  if (existingTicket) {
    return res.status(400).json({
      message: "Ticket already exists",
    });
  }
  try {
    const ticket = await Ticket.create({
      bookingId,
      chairId,
      price,
    });
    // update Chair
    await Chair.update({ isActive: true }, { where: { id: chairId } });
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTicketById = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: Booking,
          as: "Booking",
        },
        {
          model: Chair,
          as: "Chair",
        },
      ],
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getTicketsByBookingId = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const tickets = await Ticket.findAll({
      where: { bookingId },
      include: [
        {
          model: Chair,
          as: "Chair",
        },
      ],
    });
    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this booking" });
    }
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { bookingId, chairId, price } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update ticket details
    ticket.bookingId = bookingId || ticket.bookingId;
    ticket.chairId = chairId || ticket.chairId;
    ticket.price = price || ticket.price;

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    await ticket.destroy();
    res.status(204).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};