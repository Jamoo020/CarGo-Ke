import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createTripGpsLocation, getLastTripGpsLocation, listTripGpsLocations } from "../services/gpsService";

export async function createGpsLocationController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const location = await createTripGpsLocation(req.params.tripId, req.body, req.user);
    res.status(201).json({ data: location });
  } catch (error) {
    next(error);
  }
}

export async function listGpsLocationsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const locations = await listTripGpsLocations(req.params.tripId, req.user);
    res.status(200).json({ data: locations });
  } catch (error) {
    next(error);
  }
}

export async function getLastGpsLocationController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const location = await getLastTripGpsLocation(req.params.tripId, req.user);
    res.status(200).json({ data: location });
  } catch (error) {
    next(error);
  }
}
