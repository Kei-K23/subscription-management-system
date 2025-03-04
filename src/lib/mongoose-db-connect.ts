import mongoose from "mongoose";
import logger from "./logger";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.info("Error when connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default dbConnect;
