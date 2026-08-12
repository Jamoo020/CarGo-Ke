import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createTransportRequest,
  listTransportRequests,
  getTransportRequestById,
  cancelTransportRequest,
} from "../services/transportRequestService";
import { AppError } from "../errors/AppError";

export async function createRequest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { customerId, origin, destination, vehicleDetailId } = req.body;
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const request = await createTransportRequest(
      { customerId, origin, destination, vehicleDetailId },
      req.user,
    );

    res.status(201).json({ data: request });
  } catch (error) {
    next(error);
  }
}

export async function listRequests(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const requests = await listTransportRequests(req.user);
    res.status(200).json({ data: requests });
  } catch (error) {
    next(error);
  }
}

export async function getRequest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const request = await getTransportRequestById(req.params.id, req.user);
    res.status(200).json({ data: request });
  } catch (error) {
    next(error);
  }
}

export async function cancelRequest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const request = await cancelTransportRequest(req.params.id, req.user);
    res.status(200).json({ data: request });
  } catch (error) {
    next(error);
  }
}
