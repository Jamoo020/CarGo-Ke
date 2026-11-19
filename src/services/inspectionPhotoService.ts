import path from "path";
import * as FileType from "file-type";
import { prisma } from "../db";
import { UserRole } from "@prisma/client";
import { FileData, storageService, StoredFile } from "./storageService";
import { AppError } from "../errors/AppError";
import { CurrentUser, verifyTripParticipation } from "./authorizationService";
import { assertAdminCapability, ADMIN_CAPABILITIES } from "./adminService";
import { Express } from "express";

const TRIP_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INSPECTION_FILE_NAME_PATTERN = /^[0-9a-f]{32}\.(?:jpg|png|webp)$/;
const VALID_INSPECTION_PHOTO_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface InspectionPhotoUpload {
  photoId: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
}

export async function validateMagicBytes(buffer: Buffer, declaredMimeType: string): Promise<void> {
  if (buffer.length === 0) {
    throw new AppError("Uploaded file is empty", 400);
  }

  const detected = await FileType.fromBuffer(buffer);
  if (
    !detected ||
    !VALID_INSPECTION_PHOTO_MIME_TYPES.has(detected.mime) ||
    detected.mime !== declaredMimeType
  ) {
    throw new AppError("Unsupported file type. Upload JPG, PNG, or WebP images only.", 400);
  }
}

/**
 * InspectionPhotoService handles the upload, retrieval, and deletion of inspection photos.
 * Photos are stored using the StorageService and referenced in the Inspection.photoUrls JSON field.
 */

export async function uploadInspectionPhoto(
  tripId: string,
  file: Express.Multer.File,
  currentUser: CurrentUser,
): Promise<InspectionPhotoUpload> {
  // Verify user is authorized for this trip
  await verifyTripParticipation(tripId, currentUser);

  // Validate file
  if (!file.buffer || file.buffer.length === 0) {
    throw new AppError("Uploaded file is empty", 400);
  }

  if (!VALID_INSPECTION_PHOTO_MIME_TYPES.has(file.mimetype)) {
    throw new AppError("Unsupported file type. Upload JPG, PNG, or WebP images only.", 400);
  }

  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  if (file.buffer.length > maxFileSize) {
    throw new AppError("File size exceeds maximum allowed (10 MB)", 400);
  }

  // Store the file
  const subdirectory = `inspections/${tripId}`;
  const storedFile: StoredFile = await storageService.storeFile(file.buffer, file.mimetype, file.originalname, subdirectory);

  // Generate URL reference (can be internal API route or external URL)
  const photoId = storedFile.fileName.split(".")[0];
  const url = `/api/trips/${tripId}/inspections/photos/${storedFile.fileName}`;

  return {
    photoId,
    fileName: storedFile.fileName,
    url,
    mimeType: storedFile.mimeType,
    size: storedFile.size,
  };
}

export async function getInspectionPhotoStream(
  tripId: string,
  fileName: string,
  currentUser: CurrentUser,
): Promise<{ fileData: Buffer; mimeType: string }> {
  if (!TRIP_ID_PATTERN.test(tripId)) {
    throw new AppError("Invalid trip ID", 400);
  }

  if (!INSPECTION_FILE_NAME_PATTERN.test(fileName)) {
    throw new AppError("Invalid file name", 400);
  }

  await verifyTripParticipation(tripId, currentUser);
  if (currentUser.role === UserRole.ADMIN) {
    await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.TRIP_OVERSIGHT);
  }

  const subdirectory = path.join("uploads", "inspections", tripId);
  const resolvedDir = path.resolve(subdirectory);
  const resolvedFilePath = path.resolve(subdirectory, fileName);
  const relativeFilePath = path.relative(resolvedDir, resolvedFilePath);

  if (!relativeFilePath || relativeFilePath.startsWith("..") || path.isAbsolute(relativeFilePath)) {
    throw new AppError("Invalid file path", 400);
  }

  let fileData: FileData;
  try {
    fileData = await storageService.retrieveFile(resolvedFilePath);
  } catch (error) {
    if (error instanceof AppError && error.statusCode < 500) {
      throw error;
    }
    console.error("[InspectionPhotoService] Photo retrieval failed");
    throw new AppError("Unable to retrieve inspection photo", 500);
  }

  return {
    fileData: fileData.fileData,
    mimeType: fileData.mimeType,
  };
}

export async function deleteInspectionPhotos(tripId: string, urls: string[]): Promise<void> {
  for (const url of urls) {
    try {
      // Extract filename from URL (format: /api/trips/{tripId}/inspections/photos/{fileName})
      const match = url.match(/\/api\/trips\/[^/]+\/inspections\/photos\/(.+)$/);
      if (!match) {
        // URL is not a local storage reference (e.g., external HTTP/HTTPS), skip deletion
        continue;
      }

      const fileName = match[1];
      const subdirectory = `inspections/${tripId}`;
      const filePath = path.join("uploads", subdirectory, fileName);

      await storageService.deleteFile(filePath);
    } catch (error) {
      // Log but don't fail if we can't delete a photo
      console.error(`Failed to delete inspection photo: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }
}
