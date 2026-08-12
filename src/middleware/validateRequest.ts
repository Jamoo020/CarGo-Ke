import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function validateRegistration(req: Request, res: Response, next: NextFunction) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new AppError("email, password, and role are required", 400));
  }

  if (typeof email !== "string" || typeof password !== "string" || typeof role !== "string") {
    return next(new AppError("Invalid input types", 400));
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("email and password are required", 400));
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return next(new AppError("Invalid input types", 400));
  }

  next();
}

export function validateTransportRequestCreation(req: Request, res: Response, next: NextFunction) {
  const { customerId, origin, destination, vehicleDetailId } = req.body;

  if (!origin || !destination || !vehicleDetailId) {
    return next(new AppError("origin, destination, and vehicleDetailId are required", 400));
  }

  if (typeof origin !== "string" || typeof destination !== "string" || typeof vehicleDetailId !== "string") {
    return next(new AppError("Invalid input types for transport request", 400));
  }

  if (customerId && typeof customerId !== "string") {
    return next(new AppError("Invalid customerId", 400));
  }

  next();
}

export function validateCreateDriverQuote(req: Request, res: Response, next: NextFunction) {
  const { amount, message } = req.body;

  if (amount === undefined || amount === null) {
    return next(new AppError("amount is required", 400));
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return next(new AppError("amount must be a positive number", 400));
  }

  if (message !== undefined && typeof message !== "string") {
    return next(new AppError("message must be a string", 400));
  }

  next();
}

export function validateCreatePayment(req: Request, res: Response, next: NextFunction) {
  const { providerReference } = req.body;

  if (providerReference !== undefined && typeof providerReference !== "string") {
    return next(new AppError("providerReference must be a string", 400));
  }

  next();
}

export function validateConfirmPayment(req: Request, res: Response, next: NextFunction) {
  const { providerCallbackReference } = req.body;

  if (providerCallbackReference !== undefined && typeof providerCallbackReference !== "string") {
    return next(new AppError("providerCallbackReference must be a string", 400));
  }

  next();
}

export function validateTripTransition(req: Request, res: Response, next: NextFunction) {
  const { action, reason } = req.body;
  if (!action || typeof action !== "string") {
    return next(new AppError("action is required and must be a string", 400));
  }

  if (action === "cancelTrip") {
    if (!reason || typeof reason !== "string") {
      return next(new AppError("reason is required and must be a string for cancellation", 400));
    }
    if (reason.trim().length === 0) {
      return next(new AppError("reason must not be empty", 400));
    }
  }

  next();
}

export function validateInspection(req: Request, res: Response, next: NextFunction) {
  const {
    type,
    photoUrls,
    odometer,
    fuelLevel,
    vehicleCondition,
    damageNotes,
    observations,
    handoverConfirmed,
  } = req.body;

  if (!type || (type !== "PICKUP" && type !== "DELIVERY")) {
    return next(new AppError("type is required and must be PICKUP or DELIVERY", 400));
  }

  if (!Array.isArray(photoUrls) || photoUrls.length === 0 || !photoUrls.every((url) => typeof url === "string")) {
    return next(new AppError("photoUrls is required and must be a non-empty array of strings", 400));
  }

  if (typeof odometer !== "number" || Number.isNaN(odometer) || odometer < 0) {
    return next(new AppError("odometer is required and must be a non-negative number", 400));
  }

  if (fuelLevel !== undefined && (typeof fuelLevel !== "number" || Number.isNaN(fuelLevel) || fuelLevel < 0)) {
    return next(new AppError("fuelLevel must be a non-negative number", 400));
  }

  if (!vehicleCondition || typeof vehicleCondition !== "string") {
    return next(new AppError("vehicleCondition is required and must be a string", 400));
  }

  if (damageNotes !== undefined && typeof damageNotes !== "string") {
    return next(new AppError("damageNotes must be a string", 400));
  }

  if (observations !== undefined && typeof observations !== "string") {
    return next(new AppError("observations must be a string", 400));
  }

  if (typeof handoverConfirmed !== "boolean") {
    return next(new AppError("handoverConfirmed is required and must be a boolean", 400));
  }

  next();
}

export function validateGpsLocation(req: Request, res: Response, next: NextFunction) {
  const { latitude, longitude, timestamp, accuracy } = req.body;

  if (typeof latitude !== "number" || Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    return next(new AppError("latitude is required and must be a number between -90 and 90", 400));
  }

  if (typeof longitude !== "number" || Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    return next(new AppError("longitude is required and must be a number between -180 and 180", 400));
  }

  if (timestamp !== undefined) {
    if (typeof timestamp !== "string") {
      return next(new AppError("timestamp must be a valid ISO date string", 400));
    }
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
      return next(new AppError("timestamp must be a valid ISO date string", 400));
    }
  }

  if (accuracy !== undefined && (typeof accuracy !== "number" || Number.isNaN(accuracy) || accuracy < 0)) {
    return next(new AppError("accuracy must be a non-negative number", 400));
  }

  next();
}

const MILESTONE_TYPES = new Set([
  "PICKUP_COMPLETED",
  "TRIP_STARTED",
  "FUEL_STOP",
  "ROUTE_MILESTONE",
  "DELAY",
  "DESTINATION_REACHED",
  "DELIVERY_INSPECTION_STARTED",
  "DELIVERY_COMPLETED",
  "OTHER",
]);

export function validateTripMilestone(req: Request, res: Response, next: NextFunction) {
  const { type, eventTime, latitude, longitude, accuracy, notes } = req.body;

  if (!type || typeof type !== "string" || !MILESTONE_TYPES.has(type)) {
    return next(new AppError("type is required and must be one of the supported milestone types", 400));
  }

  if (eventTime !== undefined) {
    const parsed = new Date(eventTime);
    if (Number.isNaN(parsed.getTime())) {
      return next(new AppError("eventTime must be a valid ISO date string", 400));
    }
  }

  if (latitude !== undefined && (typeof latitude !== "number" || Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return next(new AppError("latitude must be a number between -90 and 90", 400));
  }

  if (longitude !== undefined && (typeof longitude !== "number" || Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return next(new AppError("longitude must be a number between -180 and 180", 400));
  }

  if (accuracy !== undefined && (typeof accuracy !== "number" || Number.isNaN(accuracy) || accuracy < 0)) {
    return next(new AppError("accuracy must be a non-negative number", 400));
  }

  if (notes !== undefined && typeof notes !== "string") {
    return next(new AppError("notes must be a string", 400));
  }

  next();
}

export function validateCreateRefund(req: Request, res: Response, next: NextFunction) {
  const { amount, reason } = req.body;

  if (amount === undefined || amount === null) {
    return next(new AppError("amount is required", 400));
  }
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return next(new AppError("amount must be a positive number", 400));
  }
  if (!reason || typeof reason !== "string") {
    return next(new AppError("reason is required and must be a string", 400));
  }
  next();
}

export function validateCreateDispute(req: Request, res: Response, next: NextFunction) {
  const { description, category, priority } = req.body;

  if (!description || typeof description !== "string") {
    return next(new AppError("description is required and must be a string", 400));
  }

  if (description.trim().length === 0) {
    return next(new AppError("description must not be empty", 400));
  }

  const allowedCategories = [
    "VEHICLE_CONDITION",
    "DRIVER_CONDUCT",
    "PAYMENT",
    "FUEL",
    "DELIVERY",
    "DESTINATION",
    "DAMAGE",
    "OTHER",
  ];

  if (category !== undefined) {
    if (typeof category !== "string" || !allowedCategories.includes(category)) {
      return next(new AppError("category is invalid", 400));
    }
  }

  const allowedPriorities = ["LOW", "NORMAL", "HIGH"];
  if (priority !== undefined) {
    if (typeof priority !== "string" || !allowedPriorities.includes(priority)) {
      return next(new AppError("priority is invalid", 400));
    }
  }

  next();
}

export function validateUpdateDispute(req: Request, res: Response, next: NextFunction) {
  const { status, resolutionType, resolutionAmount, resolutionSummary } = req.body;

  if (status !== undefined && typeof status !== "string") {
    return next(new AppError("status must be a string", 400));
  }

  if (resolutionType !== undefined && typeof resolutionType !== "string") {
    return next(new AppError("resolutionType must be a string", 400));
  }

  if (resolutionAmount !== undefined && (typeof resolutionAmount !== "number" || Number.isNaN(resolutionAmount) || resolutionAmount < 0)) {
    return next(new AppError("resolutionAmount must be a non-negative number", 400));
  }

  if (resolutionSummary !== undefined && typeof resolutionSummary !== "string") {
    return next(new AppError("resolutionSummary must be a string", 400));
  }

  next();
}
