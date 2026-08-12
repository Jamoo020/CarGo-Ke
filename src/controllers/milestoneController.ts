import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createTripMilestone, listTripMilestones } from "../services/milestoneService";

export async function createTripMilestoneController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const milestone = await createTripMilestone(req.params.tripId, req.body, req.user);
    res.status(201).json({ data: milestone });
  } catch (error) {
    next(error);
  }
}

export async function listTripMilestonesController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const milestones = await listTripMilestones(req.params.tripId, req.user);
    res.status(200).json({ data: milestones });
  } catch (error) {
    next(error);
  }
}
