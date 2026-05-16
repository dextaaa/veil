import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export const TOKENS_PACKAGE = {
  tokens: 300,
  priceInCents: 2000,
  label: "300 Veil Tokens",
  description: "60 early photo reveals · Never expires",
};
