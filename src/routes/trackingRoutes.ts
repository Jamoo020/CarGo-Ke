import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createGpsLocationController,
  getLastGpsLocationController,
  listGpsLocationsController,
} from "../controllers/gpsController";
import { createTripMilestoneController, listTripMilestonesController } from "../controllers/milestoneController";
import { validateGpsLocation, validateTripMilestone } from "../middleware/validateRequest";

const router = Router();

router.post("/trips/:tripId/gps", authenticate, validateGpsLocation, createGpsLocationController);
router.get("/trips/:tripId/gps", authenticate, listGpsLocationsController);
router.get("/trips/:tripId/gps/last", authenticate, getLastGpsLocationController);

router.post("/trips/:tripId/milestones", authenticate, validateTripMilestone, createTripMilestoneController);
router.get("/trips/:tripId/milestones", authenticate, listTripMilestonesController);

export default router;
