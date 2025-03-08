import mongoose from "mongoose";
import { config } from "./config";
import { app } from "./app";
import { Server } from "http";

// Start the cron job
import "./cronJobs/index";

let server: Server;

// MongoDB connection
mongoose
  .connect(config.mongoose.url)
  .then(() => {
    console.log("Connected to MongoDB");
    server = app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error("Unexpected error occur: ", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  exitHandler();
});
