import express, { urlencoded, json } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { config } from "./config";
import morgan from "morgan";

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

export { app };
