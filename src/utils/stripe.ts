import { config } from "@/config";
import Stripe from "stripe";

// Set up Stripe instance
const stripe = new Stripe(config.stripe.secret, {
  apiVersion: "2025-02-24.acacia",
});

export { stripe };
