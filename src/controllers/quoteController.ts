import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createDriverQuote,
  listQuotesForTransportRequest,
  getQuoteById,
  selectQuote,
  listMyQuotes,
} from "../services/quoteService";
import { AppError } from "../errors/AppError";

export async function createQuote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount, message } = req.body;
    const { transportRequestId } = req.params;

    const quote = await createDriverQuote(transportRequestId, { amount, message }, req.user);
    res.status(201).json({ data: quote });
  } catch (error) {
    next(error);
  }
}

export async function listQuotes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { transportRequestId } = req.params;
    const quotes = await listQuotesForTransportRequest(transportRequestId, req.user);
    res.status(200).json({ data: quotes });
  } catch (error) {
    next(error);
  }
}

export async function getQuote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = req.params;
    const quote = await getQuoteById(id, req.user);
    res.status(200).json({ data: quote });
  } catch (error) {
    next(error);
  }
}

export async function chooseQuote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = req.params;
    const quote = await selectQuote(id, req.user);
    res.status(200).json({ data: quote });
  } catch (error) {
    next(error);
  }
}

export async function listDriverQuotes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const quotes = await listMyQuotes(req.user);
    res.status(200).json({ data: quotes });
  } catch (error) {
    next(error);
  }
}
