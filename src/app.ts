import express from "express";
import { config } from "./config";
import authRoutes from "./routes/authRoutes";
import transportRequestRoutes from "./routes/transportRequestRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import refundRoutes from "./routes/refundRoutes";
import walletRoutes from "./routes/walletRoutes";
import tripRoutes from "./routes/tripRoutes";
import inspectionRoutes from "./routes/inspectionRoutes";
import trackingRoutes from "./routes/trackingRoutes";
import disputeRoutes from "./routes/disputeRoutes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf.toString("utf8");
  },
}));
app.use("/api/auth", authRoutes);
app.use("/api/transport-requests", transportRequestRoutes);
app.use("/api", quoteRoutes);
app.use("/api", paymentRoutes);
app.use("/api", refundRoutes);
app.use("/api", walletRoutes);
app.use("/api", tripRoutes);
app.use("/api", inspectionRoutes);
app.use("/api", trackingRoutes);
app.use("/api", disputeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: config.environment });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found", status: "error" });
});

app.use(errorHandler);

export default app;
