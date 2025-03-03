import express from "express";
import logger from "./utils/logger";
import cors from "cors";

// Load environment variable
import "dotenv/config";
import dbConnect from "./utils/db-connect";

const app = express();

// Register middlewares
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`);

  // MongoDb connection here
  await dbConnect();
});
