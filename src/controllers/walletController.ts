import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import walletService from "../services/walletService";
import { AppError } from "../errors/AppError";

export async function getWalletForTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { tripId } = req.params;
    const wallet = await walletService.getTripWallet(tripId, req.user);
    res.status(200).json({ data: wallet });
  } catch (error) {
    next(error);
  }
}

export async function releaseDriverFundsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { tripId } = req.params;
    const result = await walletService.releaseDriverFunds(tripId, req.user);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export default { getWalletForTrip, releaseDriverFundsController };
