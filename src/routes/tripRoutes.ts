import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { listTripsController, getTripController, transitionTripController } from "../controllers/tripController";
import { validateTripTransition } from "../middleware/validateRequest";

const router = Router();

router.get("/trips", authenticate, listTripsController);
router.get("/trips/:tripId", authenticate, getTripController);
router.post("/trips/:tripId/transitions", authenticate, validateTripTransition, transitionTripController);

export default router;
