import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createTripPayment,
  confirmTripPayment,
  getPayment,
  getTripPayment,
  processProviderPaymentCallback,
} from "../services/paymentService";
import { AppError } from "../errors/AppError";
import { verifyPaymentWebhookSignature, getPaymentWebhookPayloadRaw, PAYMENT_WEBHOOK_SIGNATURE_HEADER } from "../services/paymentProvider";

export async function createPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { providerReference } = req.body;
    const { tripId } = req.params;

    const payment = await createTripPayment(tripId, { providerReference }, req.user);
    res.status(201).json({ data: payment });
  } catch (error) {
    next(error);
  }
}

export async function confirmPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { providerCallbackReference } = req.body;
    const { paymentId } = req.params;

    const payment = await confirmTripPayment(paymentId, { providerCallbackReference }, req.user);
    res.status(200).json({ data: payment });
  } catch (error) {
    next(error);
  }
}

export async function paymentWebhook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const signature = req.header(PAYMENT_WEBHOOK_SIGNATURE_HEADER) ?? undefined;
    const rawBody = getPaymentWebhookPayloadRaw((req as any).rawBody ?? "");

    verifyPaymentWebhookSignature(signature, rawBody);

    const payment = await processProviderPaymentCallback(req.body, rawBody);
    res.status(200).json({ data: payment });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { paymentId } = req.params;
    const payment = await getPayment(paymentId, req.user);
    res.status(200).json({ data: payment });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentForTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { tripId } = req.params;
    const payment = await getTripPayment(tripId, req.user);
    res.status(200).json({ data: payment });
  } catch (error) {
    next(error);
  }
}
