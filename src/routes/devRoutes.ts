import { Router } from "express";
import { AuthRequest, authenticate } from "../middleware/authMiddleware";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, PaymentStatus } from "@prisma/client";
import { transitionTripStatus } from "../services/tripService";

const router = Router();

/**
 * DEV ONLY: Confirm all pending payments for a trip
 * This moves the trip from PAYMENT_PENDING to BOOKED status
 */
router.post("/trips/:tripId/dev/confirm-payment", authenticate, async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { tripId },
      include: { trip: true },
    });

    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    if (payment.status === PaymentStatus.CONFIRMED) {
      return res.status(200).json({
        data: payment,
        message: "Payment already confirmed",
      });
    }

    // Confirm the payment (this transitions trip to BOOKED)
    const confirmed = await prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.CONFIRMED,
          providerCallbackReference: `dev_confirmed_${Date.now()}`,
        },
      });

      // Transition trip to BOOKED
      await tx.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.BOOKED },
      });

      await tx.transportRequest.update({
        where: { id: payment.trip.transportRequestId },
        data: { status: TripStatus.BOOKED },
      });

      return updated;
    });

    res.status(200).json({
      data: confirmed,
      message: "Payment confirmed, trip moved to BOOKED",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DEV ONLY: Advance trip through required statuses to PICKUP_PENDING
 * This allows photo uploads and inspection submission
 */
router.post("/trips/:tripId/dev/advance-to-pickup", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { tripId } = req.params;
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const currentUser = req.user;

    // Trip must be BOOKED to start the flow
    let trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    console.log(`[DEV] Advancing trip ${tripId} from ${trip.status} to PICKUP_PENDING`);

    // If still in PAYMENT_PENDING, confirm payment first
    if (trip.status === TripStatus.PAYMENT_PENDING) {
      console.log(`[DEV] Trip still in PAYMENT_PENDING, confirming payment first...`);
      const payment = await prisma.payment.findUnique({ where: { tripId } });
      if (payment && payment.status !== PaymentStatus.CONFIRMED) {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: PaymentStatus.CONFIRMED },
          });
          await tx.trip.update({
            where: { id: tripId },
            data: { status: TripStatus.BOOKED },
          });
        });
      }
      trip = await prisma.trip.findUnique({ where: { id: tripId } });
    }

    // Now advance through the required transitions
    const transitions = [
      { action: "beginPickup", fromStatus: TripStatus.BOOKED, toStatus: TripStatus.PICKUP_PENDING },
    ];

    for (const { action, fromStatus, toStatus } of transitions) {
      if (trip && trip.status === fromStatus) {
        console.log(`[DEV] Executing: ${action} (${fromStatus} -> ${toStatus})`);
        trip = await transitionTripStatus(tripId, action, currentUser, {});
      } else if (trip && trip.status === toStatus) {
        console.log(`[DEV] Trip already at ${toStatus}, skipping`);
      }
    }

    res.status(200).json({
      data: trip,
      message: `Trip advanced to ${trip?.status}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
