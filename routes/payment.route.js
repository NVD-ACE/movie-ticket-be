import express from "express";
import { createPayment } from "../controllers/payment.controller.js";
const paymentRoute = express.Router();
paymentRoute.post("/", createPayment);
export default paymentRoute;