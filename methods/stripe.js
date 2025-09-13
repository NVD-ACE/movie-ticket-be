import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";
import { Ticket } from "../models/ticket.model.js";

const stripe = new Stripe("sk_test_...."); // secret key của bạn

export const createStripePayment = async (req, res) => {
  const { userId, ticketIds } = req.body;

  const tickets = await Ticket.findAll({ where: { id: ticketIds } });
  const totalAmount = tickets.reduce((sum, t) => sum + t.price, 0);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: tickets.map(ticket => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Vé ghế ${ticket.chairId}`,
        },
        unit_amount: ticket.price * 100,
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: "https://your-frontend.com/payment-success",
    cancel_url: "https://your-frontend.com/payment-fail",
  });

  const payment = await Payment.create({
    userId,
    totalAmount,
    method: "stripe",
    status: "pending",
    transactionId: session.id
  });

  await Ticket.update({ paymentId: payment.id }, {
    where: { id: ticketIds }
  });

  res.json({ paymentUrl: session.url });
};
