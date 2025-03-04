import express from "express";
import logger from "./lib/logger";
import cors from "cors";
import userRoutes from "./modules/users/user.routes";

// Load environment variable
import "dotenv/config";
import dbConnect from "./lib/mongoose-db-connect";

const app = express();

// Register middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`);

  // MongoDb connection here
  await dbConnect();
});
