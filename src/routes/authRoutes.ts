import { Router } from "express";
import { register, login, me, adminCheck } from "../controllers/authController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { validateLogin, validateRegistration } from "../middleware/validateRequest";
import {
  loginRateLimiter,
  registrationRateLimiter,
} from "../middleware/rateLimitMiddleware";

const router = Router();

router.post("/register", registrationRateLimiter, validateRegistration, register);
router.post("/login", loginRateLimiter, validateLogin, login);
router.get("/me", authenticate, me);
router.get("/admin", authenticate, authorize(["ADMIN"]), adminCheck);

export default router;
