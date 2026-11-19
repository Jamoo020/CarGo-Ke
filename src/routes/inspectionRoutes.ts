import multer from "multer";
import { RequestHandler, Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { validateMagicBytes } from "../services/inspectionPhotoService";
import {
  createInspectionController,
  listInspectionsController,
  uploadInspectionPhotoController,
  serveInspectionPhotoController,
} from "../controllers/inspectionController";
import { validateInspection } from "../middleware/validateRequest";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
  fileFilter: (_req, file, callback) => {
    const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error("Unsupported file type. Upload JPG, PNG, or WebP images only."));
  },
});

const validateUploadedPhotoMagicBytes: RequestHandler = async (req, _res, next) => {
  try {
    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map((file) => validateMagicBytes(file.buffer, file.mimetype)));
    }
    next();
  } catch (error) {
    next(error);
  }
};

const router = Router();

router.post(
  "/trips/:tripId/inspections/photos",
  authenticate,
  upload.array("files", 10),
  validateUploadedPhotoMagicBytes,
  uploadInspectionPhotoController,
);
router.get("/trips/:tripId/inspections/photos/:fileName", authenticate, serveInspectionPhotoController);
router.post("/trips/:tripId/inspections", authenticate, validateInspection, createInspectionController);
router.get("/trips/:tripId/inspections", authenticate, listInspectionsController);

export default router;
