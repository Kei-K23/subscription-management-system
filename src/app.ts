import express, { urlencoded, json, raw } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { config } from "./config";
import morgan from "morgan";
import { ApiError } from "./utils/api-error";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { planRoutes } from "./routes/plan.route";
import { subscriptionRoutes } from "./routes/subscription.route";
import { SubscriptionController } from "./controllers/subscription.controller";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    limit: 100, // 15 minutes - 100 request from same IP address
  })
);

// Compression Middleware
app.use(compression());

// Logging Middleware
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Webhook routes
// Use Stripe Checkout webhook
app.post(
  "/api/v1/webhooks/subscriptions/checkout",
  raw({ type: "application/json" }),
  SubscriptionController.handleStripeWebhook
);

// Request body parsing Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

// 404 Handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Not Found"));
});

// Error handling Middleware
app.use(
  (
    err: ApiError,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      ...(config.env === "development" && { stack: err.stack }),
    });
  }
);

export { app };
