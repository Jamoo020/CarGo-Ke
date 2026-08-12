import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AppError } from "../errors/AppError";
import {
  approveDriverAdmin,
  getDriverAdmin,
  getPaymentAdmin,
  getPlatformSettingAdmin,
  getTripAdmin,
  getUserAdmin,
  listAuditLogsAdmin,
  listDriversAdmin,
  listPaymentsAdmin,
  listPlatformSettingsAdmin,
  listTripsAdmin,
  listUsersAdmin,
  listWalletTransactionsAdmin,
  reactivateDriverAdmin,
  rejectDriverAdmin,
  suspendDriverAdmin,
  updatePlatformSettingAdmin,
  updateUserAccountStatusAdmin,
} from "../services/adminService";
import { getDisputeById, updateDispute } from "../services/disputeService";

export async function listUsersController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const users = await listUsersAdmin(
      {
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        role: typeof req.query.role === "string" ? req.query.role : undefined,
        accountStatus: typeof req.query.accountStatus === "string" ? req.query.accountStatus : undefined,
      },
      req.user,
    );
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = await getUserAdmin(req.params.userId, req.user);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatusController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = await updateUserAccountStatusAdmin(req.params.userId, req.body, req.user);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function listDriversController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const drivers = await listDriversAdmin({ status: typeof req.query.status === "string" ? req.query.status : undefined }, req.user);
    res.status(200).json({ data: drivers });
  } catch (error) {
    next(error);
  }
}

export async function getDriverController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const driver = await getDriverAdmin(req.params.driverId, req.user);
    res.status(200).json({ data: driver });
  } catch (error) {
    next(error);
  }
}

export async function approveDriverController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const driver = await approveDriverAdmin(req.params.driverId, req.body, req.user);
    res.status(200).json({ data: driver });
  } catch (error) {
    next(error);
  }
}

export async function rejectDriverController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const driver = await rejectDriverAdmin(req.params.driverId, req.body, req.user);
    res.status(200).json({ data: driver });
  } catch (error) {
    next(error);
  }
}

export async function suspendDriverController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const driver = await suspendDriverAdmin(req.params.driverId, req.body, req.user);
    res.status(200).json({ data: driver });
  } catch (error) {
    next(error);
  }
}

export async function reactivateDriverController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const driver = await reactivateDriverAdmin(req.params.driverId, req.body, req.user);
    res.status(200).json({ data: driver });
  } catch (error) {
    next(error);
  }
}

export async function listTripsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const trips = await listTripsAdmin(
      {
        status: typeof req.query.status === "string" ? req.query.status : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
      },
      req.user,
    );
    res.status(200).json({ data: trips });
  } catch (error) {
    next(error);
  }
}

export async function getTripController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const trip = await getTripAdmin(req.params.tripId, req.user);
    res.status(200).json({ data: trip });
  } catch (error) {
    next(error);
  }
}

export async function listPaymentsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const payments = await listPaymentsAdmin(
      {
        status: typeof req.query.status === "string" ? req.query.status : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
      },
      req.user,
    );
    res.status(200).json({ data: payments });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const payment = await getPaymentAdmin(req.params.paymentId, req.user);
    res.status(200).json({ data: payment });
  } catch (error) {
    next(error);
  }
}

export async function listWalletTransactionsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const transactions = await listWalletTransactionsAdmin(
      {
        type: typeof req.query.type === "string" ? req.query.type : undefined,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
      },
      req.user,
    );
    res.status(200).json({ data: transactions });
  } catch (error) {
    next(error);
  }
}

export async function listSettingsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const settings = await listPlatformSettingsAdmin(req.user);
    res.status(200).json({ data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettingController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const setting = await updatePlatformSettingAdmin(req.params.key, req.body, req.user);
    res.status(200).json({ data: setting });
  } catch (error) {
    next(error);
  }
}

export async function getSettingController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const setting = await getPlatformSettingAdmin(req.params.key, req.user);
    res.status(200).json({ data: setting });
  } catch (error) {
    next(error);
  }
}

export async function listAuditLogsController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const logs = await listAuditLogsAdmin(req.user);
    res.status(200).json({ data: logs });
  } catch (error) {
    next(error);
  }
}

export async function getAdminDisputeController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const dispute = await getDisputeById(req.params.disputeId, req.user);
    res.status(200).json({ data: dispute });
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateDisputeController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const dispute = await updateDispute(req.params.disputeId, req.body, req.user);
    res.status(200).json({ data: dispute });
  } catch (error) {
    next(error);
  }
}
