import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  getAllowedTripTransitionActions,
  getTripById,
  listTrips,
  transitionTripStatus,
} from "../services/tripService";
import { AppError } from "../errors/AppError";

export async function listTripsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const trips = await listTrips(req.user);
    res.status(200).json({ data: trips });
  } catch (error) {
    next(error);
  }
}

export async function getTripController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const trip = await getTripById(req.params.tripId, req.user);
    res.status(200).json({ data: trip });
  } catch (error) {
    next(error);
  }
}

export async function transitionTripController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const { action } = req.body;
    const updatedTrip = await transitionTripStatus(req.params.tripId, action, req.user, req.body);
    res.status(200).json({ data: updatedTrip, allowedActions: getAllowedTripTransitionActions() });
  } catch (error) {
    next(error);
  }
}
