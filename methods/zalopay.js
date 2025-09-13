import { Payment } from "../models/payment.model.js";
import { Ticket } from "../models/ticket.model.js";

export const createZaloPayPayment = async (req, res) => {
  const { userId, ticketIds } = req.body;

  const tickets = await Ticket.findAll({ where: { id: ticketIds } });
  const totalAmount = tickets.reduce((sum, t) => sum + t.price, 0);

  const transactionId = "ZALO_" + Date.now();

  const payment = await Payment.create({
    userId,
    totalAmount,
    method: "zalopay",
    status: "pending",
    transactionId
  });

  await Ticket.update({ paymentId: payment.id }, {
    where: { id: ticketIds }
  });

  // Giả lập URL thanh toán
  const paymentUrl = `https://sandbox.zalopay.vn/fake-payment/${transactionId}`;
  res.json({ paymentUrl });
};
