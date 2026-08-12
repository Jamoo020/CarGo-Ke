import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getWalletForTrip } from "../controllers/walletController";

const router = Router();

router.get("/trips/:tripId/wallet", authenticate, getWalletForTrip);

export default router;
