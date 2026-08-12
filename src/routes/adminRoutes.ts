import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { requireAdminCapability } from "../middleware/adminMiddleware";
import { ADMIN_CAPABILITIES } from "../services/adminService";
import {
  approveDriverController,
  adminUpdateDisputeController,
  getAdminDisputeController,
  getDriverController,
  getPaymentController,
  getSettingController,
  getTripController,
  getUserController,
  listAuditLogsController,
  listDriversController,
  listPaymentsController,
  listSettingsController,
  listTripsController,
  listUsersController,
  listWalletTransactionsController,
  reactivateDriverController,
  rejectDriverController,
  suspendDriverController,
  updateSettingController,
  updateUserStatusController,
} from "../controllers/adminController";

const router = Router();

router.use(authenticate, authorize(["ADMIN"]));

router.get("/users", requireAdminCapability(ADMIN_CAPABILITIES.USER_MANAGEMENT), listUsersController);
router.get("/users/:userId", requireAdminCapability(ADMIN_CAPABILITIES.USER_MANAGEMENT), getUserController);
router.patch("/users/:userId/status", requireAdminCapability(ADMIN_CAPABILITIES.USER_MANAGEMENT), updateUserStatusController);

router.get("/drivers", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), listDriversController);
router.get("/drivers/:driverId", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), getDriverController);
router.patch("/drivers/:driverId/approve", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), approveDriverController);
router.patch("/drivers/:driverId/reject", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), rejectDriverController);
router.patch("/drivers/:driverId/suspend", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), suspendDriverController);
router.patch("/drivers/:driverId/reactivate", requireAdminCapability(ADMIN_CAPABILITIES.DRIVER_VERIFICATION), reactivateDriverController);

router.get("/trips", requireAdminCapability(ADMIN_CAPABILITIES.TRIP_OVERSIGHT), listTripsController);
router.get("/trips/:tripId", requireAdminCapability(ADMIN_CAPABILITIES.TRIP_OVERSIGHT), getTripController);

router.get("/payments", requireAdminCapability(ADMIN_CAPABILITIES.PAYMENT_OVERSIGHT), listPaymentsController);
router.get("/payments/:paymentId", requireAdminCapability(ADMIN_CAPABILITIES.PAYMENT_OVERSIGHT), getPaymentController);

router.get("/wallet-transactions", requireAdminCapability(ADMIN_CAPABILITIES.WALLET_OVERSIGHT), listWalletTransactionsController);

router.get("/disputes/:disputeId", requireAdminCapability(ADMIN_CAPABILITIES.DISPUTE_MANAGEMENT), getAdminDisputeController);
router.patch("/disputes/:disputeId", requireAdminCapability(ADMIN_CAPABILITIES.DISPUTE_MANAGEMENT), adminUpdateDisputeController);

router.get("/config", requireAdminCapability(ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT), listSettingsController);
router.get("/config/:key", requireAdminCapability(ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT), getSettingController);
router.patch("/config/:key", requireAdminCapability(ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT), updateSettingController);

router.get("/audit-logs", requireAdminCapability(ADMIN_CAPABILITIES.AUDIT_LOG_ACCESS), listAuditLogsController);

export default router;
