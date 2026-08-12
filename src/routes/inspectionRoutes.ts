import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createInspectionController, listInspectionsController } from "../controllers/inspectionController";
import { validateInspection } from "../middleware/validateRequest";

const router = Router();

router.post("/trips/:tripId/inspections", authenticate, validateInspection, createInspectionController);
router.get("/trips/:tripId/inspections", authenticate, listInspectionsController);

export default router;
