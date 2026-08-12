import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { createRefund } from "../services/refundService";
import { AppError } from "../errors/AppError";

export async function createRefundController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { tripId } = req.params;
    const { amount, reason } = req.body;

    const refund = await createRefund(tripId, { amount, reason }, req.user);
    res.status(201).json({ data: refund });
  } catch (error) {
    next(error);
  }
}
