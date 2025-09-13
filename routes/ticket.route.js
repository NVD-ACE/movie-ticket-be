import express from "express";
import { createTicket,deleteTicket, getAllTickets, getTicketById, getTicketsByBookingId, updateTicket } from "../controllers/ticket.controller.js";

const ticketRoute = express.Router();
ticketRoute.post("/", createTicket);
ticketRoute.get("/", getAllTickets);
ticketRoute.get("/:id", getTicketById);
ticketRoute.get("/booking/:bookingId", getTicketsByBookingId);
ticketRoute.put("/:id", updateTicket);
ticketRoute.delete("/:id", deleteTicket);

export default ticketRoute;
