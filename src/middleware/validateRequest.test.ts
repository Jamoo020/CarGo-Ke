import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { validateTransportRequestCreation } from "./validateRequest";

describe("validateTransportRequestCreation location requirements", () => {
  const validBody = {
    origin: "Kisumu, Kenya",
    destination: "Nakuru, Kenya",
    pickupAddress: "Kisumu, Kenya",
    pickupLatitude: -0.0917,
    pickupLongitude: 34.768,
    destinationAddress: "Nakuru, Kenya",
    destinationLatitude: -0.3031,
    destinationLongitude: 36.08,
    make: "Toyota",
    model: "Hilux",
    year: 2022,
    registrationNumber: "KAB 123A",
  };

  function validate(body: Record<string, unknown>) {
    const next = jest.fn();
    validateTransportRequestCreation(
      { body } as Request,
      {} as Response,
      next as NextFunction,
    );
    return next;
  }

  it("accepts distinct Kenyan locations with complete vehicle data", () => {
    const next = validate(validBody);
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects approximate development city-centre locations", () => {
    const next = validate({
      ...validBody,
      pickupAddress: "Nairobi (approximate city centre)",
    });
    expect(next.mock.calls[0]?.[0]).toMatchObject({
      message: "Approximate development locations cannot be used for transport requests",
    } satisfies Partial<AppError>);
  });

  it("requires driving route fields to be supplied together", () => {
    const next = validate({ ...validBody, distanceMeters: 1000 });
    expect(next.mock.calls[0]?.[0]).toMatchObject({
      message: "Driving route distance, duration, and polyline must be provided together",
    } satisfies Partial<AppError>);
  });
});
