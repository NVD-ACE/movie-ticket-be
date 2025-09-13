import { createMomoPayment } from "../methods/momo.js";
import { createStripePayment } from "../methods/stripe.js";
import { createZaloPayPayment } from "../methods/zalopay.js";

export const createPayment = async (req, res) => {
  const { method } = req.body;

  if (!["momo", "stripe", "zalopay"].includes(method)) {
    return res.status(400).json({ error: "Phương thức không hợp lệ" });
  }

  try {
    if (method === "momo") return await createMomoPayment(req, res);
    if (method === "stripe") return await createStripePayment(req, res);
    if (method === "zalopay") return await createZaloPayPayment(req, res);
    
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({ error: "Lỗi tạo thanh toán" });
  }
};
export const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};