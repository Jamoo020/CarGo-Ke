import { Router } from "express";
import { createRequest, listRequests, getRequest, cancelRequest } from "../controllers/transportRequestController";
import { authenticate } from "../middleware/authMiddleware";
import { validateTransportRequestCreation } from "../middleware/validateRequest";

const router = Router();

router.post("/", authenticate, validateTransportRequestCreation, createRequest);
router.get("/", authenticate, listRequests);
router.get("/:id", authenticate, getRequest);
router.post("/:id/cancel", authenticate, cancelRequest);

export default router;
