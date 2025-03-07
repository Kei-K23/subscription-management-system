import { z } from "zod";
// Load env values
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("3000"),
  APP_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.preprocess(
    (val) => Number(val),
    z.number().default(604800000)
  ),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("Invalid environment variables: ", envVars.error);
  process.exit(1);
}

export const config = {
  appUrl: envVars.data.APP_URL,
  port: envVars.data.PORT,
  env: envVars.data.NODE_ENV,
  mongoose: {
    url: envVars.data.MONGODB_URI,
  },
  jwt: {
    secret: envVars.data.JWT_SECRET,
    expiresIn: envVars.data.JWT_EXPIRES_IN,
  },
  stripe: {
    secret: envVars.data.STRIPE_SECRET_KEY,
    webSecret: envVars.data.STRIPE_WEBHOOK_SECRET,
  },
};
