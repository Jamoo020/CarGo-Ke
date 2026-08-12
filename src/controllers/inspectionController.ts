import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createTripInspection, listTripInspections } from "../services/inspectionService";

export async function createInspectionController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const inspection = await createTripInspection(req.params.tripId, req.body, req.user);
    res.status(201).json({ data: inspection });
  } catch (error) {
    next(error);
  }
}

export async function listInspectionsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const inspections = await listTripInspections(req.params.tripId, req.user);
    res.status(200).json({ data: inspections });
  } catch (error) {
    next(error);
  }
}
