import fs from "fs";
import path from "path";
import crypto from "crypto";
import { AppError } from "../errors/AppError";

export interface StoredFile {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
}

export interface FileData {
  fileData: Buffer;
  mimeType: string;
  fileName: string;
}

/**
 * StorageService provides abstraction for file storage.
 * Current implementation uses local filesystem in the uploads/ directory.
 * Can be replaced with cloud storage (S3, Azure, Supabase, etc.) later.
 */
export class StorageService {
  private uploadsDir: string;

  constructor(uploadsDir: string = "uploads") {
    this.uploadsDir = uploadsDir;
    this.ensureDirectoryExists(this.uploadsDir);
  }

  /**
   * Store an uploaded file safely
   */
  async storeFile(
    fileBuffer: Buffer,
    mimeType: string,
    _originalFileName: string,
    subdirectory: string,
  ): Promise<StoredFile> {
    // Validate inputs
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new AppError("File buffer is empty", 400);
    }

    // Generate unique filename to prevent collisions and path traversal
    const uniqueFileName = `${crypto.randomBytes(16).toString("hex")}.${this.getExtensionFromMimeType(mimeType)}`;

    // Construct safe path
    const targetDir = path.join(this.uploadsDir, subdirectory);
    this.ensureDirectoryExists(targetDir);

    const filePath = path.join(targetDir, uniqueFileName);

    // Prevent path traversal attacks
    const realTargetDir = path.resolve(targetDir);
    const realFilePath = path.resolve(filePath);

    if (!realFilePath.startsWith(realTargetDir)) {
      throw new AppError("Invalid file path", 400);
    }

    // Write file
    try {
      fs.writeFileSync(realFilePath, fileBuffer as any);
    } catch (error) {
      throw new AppError(`Failed to store file: ${error instanceof Error ? error.message : "unknown error"}`, 500);
    }

    return {
      fileName: uniqueFileName,
      filePath: realFilePath,
      mimeType,
      size: fileBuffer.length,
    };
  }

  /**
   * Retrieve a stored file by path (must be verified to be safe first)
   */
  async retrieveFile(filePath: string): Promise<FileData> {
    // Prevent path traversal: ensure the resolved path is within uploads
    const realPath = path.resolve(filePath);
    const realUploadsDir = path.resolve(this.uploadsDir);

    if (!realPath.startsWith(realUploadsDir)) {
      throw new AppError("Unauthorized file access", 403);
    }

    try {
      if (!fs.existsSync(realPath)) {
        throw new AppError("File not found", 404);
      }

      const fileData = fs.readFileSync(realPath);
      const mimeType = this.getMimeTypeFromExtension(path.extname(realPath));
      const fileName = path.basename(realPath);

      return { fileData, mimeType, fileName };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Failed to retrieve file: ${error instanceof Error ? error.message : "unknown error"}`,
        500,
      );
    }
  }

  /**
   * Delete a stored file
   */
  async deleteFile(filePath: string): Promise<void> {
    const realPath = path.resolve(filePath);
    const realUploadsDir = path.resolve(this.uploadsDir);

    if (!realPath.startsWith(realUploadsDir)) {
      throw new AppError("Unauthorized file access", 403);
    }

    try {
      if (fs.existsSync(realPath)) {
        fs.unlinkSync(realPath);
      }
    } catch (error) {
      throw new AppError(
        `Failed to delete file: ${error instanceof Error ? error.message : "unknown error"}`,
        500,
      );
    }
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    return mimeToExt[mimeType] || "bin";
  }

  private getMimeTypeFromExtension(ext: string): string {
    const extToMime: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    return extToMime[ext.toLowerCase()] || "application/octet-stream";
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
