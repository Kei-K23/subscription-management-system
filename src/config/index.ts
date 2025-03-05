import { z } from "zod";
// Load env values
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("Invalid environment variables: ", envVars.error);
  process.exit(1);
}

export const config = {
  port: envVars.data.PORT,
  env: envVars.data.NODE_ENV,
  mongoose: {
    url: envVars.data.MONGODB_URI,
  },
  jwt: {
    secret: envVars.data.JWT_SECRET,
    expiresIn: envVars.data.JWT_EXPIRES_IN,
  },
};
