import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createTripMilestone, listTripMilestones } from "../services/milestoneService";
import { emitToAuthorizedTripRoom } from "../socket";

export async function createTripMilestoneController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const io = (req.app as any).io;
    const ioEmit = io
      ? (room: string, event: string, data: unknown) =>
          emitToAuthorizedTripRoom(io, room.slice("trip:".length), event, data)
      : undefined;
    const milestone = await createTripMilestone(req.params.tripId, req.body, req.user, ioEmit);
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
