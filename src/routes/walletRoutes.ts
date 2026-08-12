import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getWalletForTrip, releaseDriverFundsController } from "../controllers/walletController";

const router = Router();

router.get("/trips/:tripId/wallet", authenticate, getWalletForTrip);
router.post("/trips/:tripId/wallet/releases", authenticate, releaseDriverFundsController);

export default router;
