import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { validateCreateRefund } from "../middleware/validateRequest";
import { createRefundController } from "../controllers/refundController";

const router = Router();

router.post("/trips/:tripId/refunds", authenticate, validateCreateRefund, createRefundController);

export default router;
