import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createQuote,
  listQuotes,
  getQuote,
  chooseQuote,
  listDriverQuotes,
} from "../controllers/quoteController";
import { validateCreateDriverQuote } from "../middleware/validateRequest";

const router = Router();

router.post("/transport-requests/:transportRequestId/quotes", authenticate, validateCreateDriverQuote, createQuote);
router.get("/transport-requests/:transportRequestId/quotes", authenticate, listQuotes);
router.get("/quotes/:id", authenticate, getQuote);
router.post("/quotes/:id/select", authenticate, chooseQuote);
router.get("/drivers/me/quotes", authenticate, listDriverQuotes);

export default router;
