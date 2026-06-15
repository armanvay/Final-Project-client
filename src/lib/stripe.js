import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRICE_ID = {
  "seeker_pro": "price_1TgSgREDIAr7NRXiLD12qGVZ",
  "seeker_premium": "price_1TgUU6EDIAr7NRXiaCfCwDq2",
  "recruiter_growth": "price_1TgUXPEDIAr7NRXiRLmJj5cN",
  "recruiter_enterprise":"price_1TgUW5EDIAr7NRXiJFUfzVqD"
};
