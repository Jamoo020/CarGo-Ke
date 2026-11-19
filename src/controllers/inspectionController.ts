import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import { createTripInspection, listTripInspections } from "../services/inspectionService";
import { getInspectionPhotoStream, uploadInspectionPhoto } from "../services/inspectionPhotoService";

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

export async function uploadInspectionPhotoController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError("At least one image file is required", 400);
    }

    const uploadedFiles = await Promise.all(
      req.files.map((file) => uploadInspectionPhoto(req.params.tripId, file as any, req.user!)),
    );

    res.status(200).json({ data: uploadedFiles });
  } catch (error) {
    next(error);
  }
}

export async function serveInspectionPhotoController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { tripId, fileName } = req.params;
    const photo = await getInspectionPhotoStream(tripId, fileName, req.user);
    res.setHeader("Content-Type", photo.mimeType);
    res.setHeader("Cache-Control", "private, no-store");
    res.status(200).send(photo.fileData);
  } catch (error) {
    next(error);
  }
}
