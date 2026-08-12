import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createDisputeController, getDisputeController, updateDisputeController } from "../controllers/disputeController";
import { validateCreateDispute, validateUpdateDispute } from "../middleware/validateRequest";

const router = Router();

router.post("/trips/:tripId/disputes", authenticate, validateCreateDispute, createDisputeController);
router.get("/disputes/:disputeId", authenticate, getDisputeController);
router.patch("/disputes/:disputeId", authenticate, validateUpdateDispute, updateDisputeController);

export default router;
