import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createPayment,
  confirmPayment,
  getPaymentById,
  getPaymentForTrip,
  paymentWebhook,
} from "../controllers/paymentController";
import { validateCreatePayment, validateConfirmPayment } from "../middleware/validateRequest";

const router = Router();

router.post("/trips/:tripId/payments", authenticate, validateCreatePayment, createPayment);
router.post("/payments/:paymentId/confirm", authenticate, validateConfirmPayment, confirmPayment);
router.post("/payments/webhook", paymentWebhook);
router.get("/payments/:paymentId", authenticate, getPaymentById);
router.get("/trips/:tripId/payments", authenticate, getPaymentForTrip);

export default router;
