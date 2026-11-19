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
import devRoutes from "./routes/devRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

// Custom JSON parser middleware that skips multipart requests
app.use((req, res, next) => {
  const contentType = req.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    console.log(`[DEBUG] Skipping JSON parser for multipart: ${req.method} ${req.path}`);
    return next();
  }
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf.toString("utf8");
    },
  })(req, res, next);
});
// Temporary debug middleware: log transport-requests incoming calls and auth header presence
app.use((req, _res, next) => {
  try {
    if (req.path && req.path.startsWith("/api/transport-requests")) {
      const hasAuth = Boolean(req.headers.authorization);
      console.log(`[DEBUG] Incoming ${req.method} ${req.path} - Authorization present: ${hasAuth}`);
    }
  } catch (e) {
    // ignore
  }
  next();
});
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
