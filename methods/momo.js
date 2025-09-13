import axios from "axios";
import crypto from "crypto";
import { Payment } from "../models/payment.model.js";
import { Ticket } from "../models/ticket.model.js";
import { sendEmail } from "../utils/sendMail.js";
import { movieTicketTemplate } from "../utils/emailTemplates.js";
import { User } from "../models/user.model.js";
// Momo payment configuration
const momoConfig = {
  partnerCode: "MOMO_PARTNER_CODE",
  accessKey: "MOMO_ACCESS_KEY",
  secretKey: "MOMO_SECRET_KEY",
  redirectUrl: "https://your-frontend.com/payment-success",
  ipnUrl: "https://your-backend.com/api/momo-ipn",
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create"
};

export const createMomoPayment = async (req, res) => {
  const { userId, ticketIds } = req.body;
  

  // Tính tổng tiền
  const tickets = await Ticket.findAll({ where: { id: ticketIds } });
  const totalAmount = tickets.reduce((sum, t) => sum + t.price, 0);

  

  const requestId = Date.now().toString();
  const orderId = "ORDER_" + requestId;

  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${totalAmount}&extraData=&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=Thanh toan ve xem phim&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

  const signature = crypto.createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId,
    amount: `${totalAmount}`,
    orderId,
    orderInfo: "Thanh toan ve xem phim",
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    requestType: "captureWallet",
    extraData: "",
    lang: "vi",
    signature
  };

  try {
    const momoRes = await axios.post(momoConfig.endpoint, requestBody);
    const paymentUrl = momoRes.data.payUrl;

    // Lưu đơn thanh toán vào DB
    const payment = await Payment.create({
      userId,
      totalAmount,
      method: "momo",
      status: "pending",
      transactionId: orderId
    });

    // Gắn `paymentId` vào các vé
    await Ticket.update({ paymentId: payment.id }, {
      where: { id: ticketIds }
    });
    // Gửi email xác nhận đặt vé
    const user = await User.findByPk(userId);
    const emailContent = movieTicketTemplate({
        user,
        tickets,
        totalAmount,
        payment: {
            method: "momo",
            transactionId: orderId
        }
        });
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html
    });
    res.json({ paymentUrl });
  } catch (err) {
    console.error("Momo error:", err.message);
    res.status(500).json({ error: "Không thể tạo thanh toán với Momo" });
  }
};
export const handleMomoIPN = async (req, res) => {
  const { partnerCode, orderId, amount, transId, errorCode } = req.body;

  if (errorCode !== "0") {
    return res.status(400).json({ error: "Payment failed" });
  }

  try {
    const payment = await Payment.findOne({ where: { transactionId: orderId } });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.status = "completed";
    payment.transactionId = transId;
    await payment.save();
    res.status(200).json({ message: "Payment successful" });
    } catch (error) {
    console.error("Error handling Momo IPN:", error);
    res.status(500).json({ error: "Internal server error" });
    }
}