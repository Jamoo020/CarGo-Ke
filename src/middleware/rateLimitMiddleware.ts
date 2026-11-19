import { rateLimit } from "express-rate-limit";

function createRateLimiter(windowMs: number, limit: number, error: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error },
  });
}

export const loginRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please try again later.",
);

export const registrationRateLimiter = createRateLimiter(
  60 * 60 * 1000,
  5,
  "Too many registration attempts. Please try again later.",
);

export const paymentInitiationRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  "Too many payment attempts. Please try again later.",
);

export const paymentWebhookRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  120,
  "Too many payment webhook requests. Please retry later.",
);
