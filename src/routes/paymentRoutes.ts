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
import {
  paymentInitiationRateLimiter,
  paymentWebhookRateLimiter,
} from "../middleware/rateLimitMiddleware";

const router = Router();

router.post(
  "/trips/:tripId/payments",
  paymentInitiationRateLimiter,
  authenticate,
  validateCreatePayment,
  createPayment,
);
router.post("/payments/:paymentId/confirm", authenticate, validateConfirmPayment, confirmPayment);
router.post("/payments/webhook", paymentWebhookRateLimiter, paymentWebhook);
router.get("/payments/:paymentId", authenticate, getPaymentById);
router.get("/trips/:tripId/payments", authenticate, getPaymentForTrip);

export default router;
