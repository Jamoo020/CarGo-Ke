import express from "express";
import request from "supertest";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { errorHandler } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import inspectionRoutes from "../routes/inspectionRoutes";
import { serveInspectionPhotoController } from "../controllers/inspectionController";
import { verifyJwtToken } from "./authService";
import { getInspectionPhotoStream } from "./inspectionPhotoService";
import { storageService } from "./storageService";
import * as adminService from "./adminService";

jest.mock("../db", () => ({
  prisma: {
    trip: { findUnique: jest.fn() },
    driver: { findUnique: jest.fn() },
    customerRepresentative: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

jest.mock("./authService", () => ({
  verifyJwtToken: jest.fn(),
}));

jest.mock("./storageService", () => ({
  storageService: {
    storeFile: jest.fn(),
    retrieveFile: jest.fn(),
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedVerifyJwtToken = verifyJwtToken as jest.Mock;
const mockedStoreFile = storageService.storeFile as jest.Mock;
const mockedRetrieveFile = storageService.retrieveFile as jest.Mock;
const tripId = "11111111-1111-4111-8111-111111111111";
const fileName = "0123456789abcdef0123456789abcdef.jpg";

function setTrip({
  customerId = "customer-1",
  driverId = "driver-profile-1",
  representativeId = null,
}: {
  customerId?: string;
  driverId?: string;
  representativeId?: string | null;
} = {}) {
  (mockedPrisma.trip.findUnique as jest.Mock).mockResolvedValue({
    id: tripId,
    customerId,
    driverId,
    transportRequest: {
      customerId,
      authorizedRepresentativeId: representativeId,
    },
  });
}

function currentUser(userId: string, role: UserRole) {
  return { userId, role };
}

const app = express();
app.use("/api", inspectionRoutes);
app.use(errorHandler);

describe("inspection photo access", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setTrip();
    mockedRetrieveFile.mockResolvedValue({
      fileData: Buffer.from("photo"),
      mimeType: "image/jpeg",
      fileName,
    });
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "admin-1",
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
    });
  });

  it("rejects anonymous photo requests at the route", async () => {
    const response = await request(app).get(`/api/trips/${tripId}/inspections/photos/${fileName}`);

    expect(response.status).toBe(401);
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("independently rejects a missing user in the photo controller", async () => {
    const req = {
      params: { tripId, fileName },
      user: undefined,
    } as unknown as AuthRequest;
    const next = jest.fn();

    await serveInspectionPhotoController(req, {} as never, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("allows the owning customer and rejects another customer", async () => {
    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("customer-1", UserRole.CUSTOMER)),
    ).resolves.toEqual({
      fileData: Buffer.from("photo"),
      mimeType: "image/jpeg",
    });

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("customer-2", UserRole.CUSTOMER)),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRetrieveFile).toHaveBeenCalledTimes(1);
  });

  it("does not read storage when a customer requests another customer's photo", async () => {
    setTrip({ customerId: "customer-2" });

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("customer-1", UserRole.CUSTOMER)),
    ).rejects.toMatchObject({ statusCode: 403 });

    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("allows only the assigned approved driver", async () => {
    (mockedPrisma.driver.findUnique as jest.Mock).mockResolvedValue({
      id: "driver-profile-1",
      verified: true,
      verificationStatus: "APPROVED",
    });

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("driver-user-1", UserRole.DRIVER)),
    ).resolves.toMatchObject({ mimeType: "image/jpeg" });

    (mockedPrisma.driver.findUnique as jest.Mock).mockResolvedValue({
      id: "driver-profile-2",
      verified: true,
      verificationStatus: "APPROVED",
    });
    mockedRetrieveFile.mockClear();

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("driver-user-2", UserRole.DRIVER)),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRetrieveFile).not.toHaveBeenCalled();

    (mockedPrisma.driver.findUnique as jest.Mock).mockResolvedValue({
      id: "driver-profile-1",
      verified: false,
      verificationStatus: "PENDING",
    });
    mockedRetrieveFile.mockClear();

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("driver-user-1", UserRole.DRIVER)),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("allows only representatives directly assigned or actively linked to the customer", async () => {
    setTrip({ representativeId: "representative-1" });
    await expect(
      getInspectionPhotoStream(
        tripId,
        fileName,
        currentUser("representative-1", UserRole.AUTHORIZED_REPRESENTATIVE),
      ),
    ).resolves.toMatchObject({ mimeType: "image/jpeg" });

    setTrip();
    (mockedPrisma.customerRepresentative.findFirst as jest.Mock).mockResolvedValue({
      customerId: "customer-1",
      representativeId: "representative-2",
      status: "ACTIVE",
      revokedAt: null,
    });
    await expect(
      getInspectionPhotoStream(
        tripId,
        fileName,
        currentUser("representative-2", UserRole.AUTHORIZED_REPRESENTATIVE),
      ),
    ).resolves.toMatchObject({ mimeType: "image/jpeg" });

    (mockedPrisma.customerRepresentative.findFirst as jest.Mock).mockResolvedValue(null);
    mockedRetrieveFile.mockClear();
    await expect(
      getInspectionPhotoStream(
        tripId,
        fileName,
        currentUser("representative-3", UserRole.AUTHORIZED_REPRESENTATIVE),
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("requires active administrator trip-oversight authorization", async () => {
    const capabilityCheck = jest.spyOn(adminService, "assertAdminCapability");
    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("admin-1", UserRole.ADMIN)),
    ).resolves.toMatchObject({ mimeType: "image/jpeg" });

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "admin-1" } });
    expect(capabilityCheck).toHaveBeenCalledWith(
      currentUser("admin-1", UserRole.ADMIN),
      "TRIP_OVERSIGHT",
    );

    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "admin-1",
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.SUSPENDED,
    });
    mockedRetrieveFile.mockClear();

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("admin-1", UserRole.ADMIN)),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
    capabilityCheck.mockRestore();
  });

  it("does not read storage when trip-oversight authorization is denied", async () => {
    const capabilityCheck = jest.spyOn(adminService, "assertAdminCapability")
      .mockRejectedValueOnce(new AppError("Forbidden", 403));

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("admin-1", UserRole.ADMIN)),
    ).rejects.toMatchObject({ statusCode: 403 });

    expect(capabilityCheck).toHaveBeenCalledWith(
      currentUser("admin-1", UserRole.ADMIN),
      "TRIP_OVERSIGHT",
    );
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
    capabilityCheck.mockRestore();
  });

  it("rejects invalid trip IDs and traversal-style or malformed filenames", async () => {
    const customer = currentUser("customer-1", UserRole.CUSTOMER);

    await expect(getInspectionPhotoStream("../outside", fileName, customer)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(getInspectionPhotoStream("not-a-uuid", fileName, customer)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(getInspectionPhotoStream(tripId, "../outside.jpg", customer)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(getInspectionPhotoStream(tripId, "..\\outside.jpg", customer)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(getInspectionPhotoStream(tripId, "other-file.txt", customer)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(
      getInspectionPhotoStream(tripId, "0123456789abcdef0123456789abcdef.svg", customer),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(mockedRetrieveFile).not.toHaveBeenCalled();
  });

  it("returns not found when the photo file is missing", async () => {
    mockedRetrieveFile.mockRejectedValue(new AppError("File not found", 404));

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("customer-1", UserRole.CUSTOMER)),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "File not found",
    });
    expect(mockedRetrieveFile).toHaveBeenCalledTimes(1);
  });

  it("does not expose storage failure details", async () => {
    mockedRetrieveFile.mockRejectedValue(new Error("storage backend unavailable"));
    const errorLog = jest.spyOn(console, "error").mockImplementation();

    await expect(
      getInspectionPhotoStream(tripId, fileName, currentUser("customer-1", UserRole.CUSTOMER)),
    ).rejects.toMatchObject({
      statusCode: 500,
      message: "Unable to retrieve inspection photo",
    });
    errorLog.mockRestore();
  });

  it("returns photo responses with private, non-cacheable headers", async () => {
    mockedVerifyJwtToken.mockReturnValue(currentUser("customer-1", UserRole.CUSTOMER));

    const response = await request(app)
      .get(`/api/trips/${tripId}/inspections/photos/${fileName}`)
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.headers["cache-control"]).toBe("private, no-store");
  });

  it("stores a valid JPEG upload and returns its MIME type", async () => {
    const jpegBuffer = Buffer.from(
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//9k=",
      "base64",
    );
    mockedVerifyJwtToken.mockReturnValue(currentUser("customer-1", UserRole.CUSTOMER));
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "customer-1",
      role: UserRole.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
    });
    mockedStoreFile.mockResolvedValue({
      fileName,
      filePath: `uploads/inspections/${tripId}/${fileName}`,
      mimeType: "image/jpeg",
      size: jpegBuffer.length,
    });

    const response = await request(app)
      .post(`/api/trips/${tripId}/inspections/photos`)
      .set("Authorization", "Bearer valid-token")
      .attach("files", jpegBuffer, { filename: "photo.jpg", contentType: "image/jpeg" });

    expect(response.status).toBe(200);
    expect(mockedStoreFile).toHaveBeenCalledWith(
      jpegBuffer,
      "image/jpeg",
      "photo.jpg",
      `inspections/${tripId}`,
    );
    expect(response.body.data[0].mimeType).toBe("image/jpeg");
  });

  it("rejects text content declared as JPEG before storing it", async () => {
    mockedVerifyJwtToken.mockReturnValue(currentUser("customer-1", UserRole.CUSTOMER));
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "customer-1",
      role: UserRole.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE,
    });

    const response = await request(app)
      .post(`/api/trips/${tripId}/inspections/photos`)
      .set("Authorization", "Bearer valid-token")
      .attach("files", Buffer.from("This is not an image"), {
        filename: "fake.jpg",
        contentType: "image/jpeg",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Unsupported file type");
    expect(mockedStoreFile).not.toHaveBeenCalled();
  });
});
