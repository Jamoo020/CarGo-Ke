import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createDispute, getDisputeById, updateDispute } from "../services/disputeService";

export async function createDisputeController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const dispute = await createDispute(req.params.tripId, req.body, req.user);
    res.status(201).json({ data: dispute });
  } catch (error) {
    next(error);
  }
}

export async function getDisputeController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const dispute = await getDisputeById(req.params.disputeId, req.user);
    res.status(200).json({ data: dispute });
  } catch (error) {
    next(error);
  }
}

export async function updateDisputeController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const dispute = await updateDispute(req.params.disputeId, req.body, req.user);
    res.status(200).json({ data: dispute });
  } catch (error) {
    next(error);
  }
}
