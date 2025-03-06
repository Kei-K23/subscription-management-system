import express, { urlencoded, json } from "express";
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

// Request body parsing Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// Compression Middleware
app.use(compression());

// Logging Middleware
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/plans", planRoutes);

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
