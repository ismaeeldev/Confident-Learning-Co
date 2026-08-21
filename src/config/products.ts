import "server-only";
import { env } from "@/lib/env";
import type { ProductKey } from "./canon";

export interface ProductConfig {
  key: ProductKey;
  displayName: string;
  /** Founders price in minor units (pence), or null when not yet approved for display. */
  founderPriceMinor: number | null;
  /** Full/RRP price in minor units (pence), or null when not yet approved for display. */
  fullPriceMinor: number | null;
  currency: "gbp";
  stripeProductId: string | undefined;
  stripePriceId: string | undefined;
}

export const products: Record<ProductKey, ProductConfig> = {
  guide: {
    key: "guide",
    displayName: "Learning Confidence Parent Guide",
    founderPriceMinor: 8900,
    fullPriceMinor: 14700,
    currency: "gbp",
    stripeProductId: env.STRIPE_GUIDE_PRODUCT_ID,
    stripePriceId: env.STRIPE_GUIDE_PRICE_ID,
  },
  membership: {
    key: "membership",
    displayName: "Inside the Loop membership",
    founderPriceMinor: 2499,
    fullPriceMinor: 2499,
    currency: "gbp",
    stripeProductId: env.STRIPE_MEMBERSHIP_PRODUCT_ID,
    stripePriceId: env.STRIPE_MEMBERSHIP_PRICE_ID,
  },
  pack_homework: {
    key: "pack_homework",
    displayName: "Homework Confidence Pack",
    founderPriceMinor: 4700,
    fullPriceMinor: 4700,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_PACK_HOMEWORK_PRICE_ID,
  },
  pack_conversations: {
    key: "pack_conversations",
    displayName: "School Conversations Toolkit",
    founderPriceMinor: 4700,
    fullPriceMinor: 4700,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_PACK_CONVERSATIONS_PRICE_ID,
  },
  pack_parents_evening: {
    key: "pack_parents_evening",
    displayName: "Parents' Evening Preparation Pack",
    founderPriceMinor: 4700,
    fullPriceMinor: 4700,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_PACK_PARENTS_EVENING_PRICE_ID,
  },
  pathway: {
    key: "pathway",
    displayName: "Pathway Call with Jane",
    founderPriceMinor: 5000,
    fullPriceMinor: 7500,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_PATHWAY_PRICE_ID,
  },
  group: {
    key: "group",
    displayName: "Group Programme",
    founderPriceMinor: 39700,
    fullPriceMinor: null,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_GROUP_PRICE_ID,
  },
  confidence_reset: {
    key: "confidence_reset",
    displayName: "The Confidence Reset",
    founderPriceMinor: 160000,
    fullPriceMinor: null,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_CONFIDENCE_RESET_PRICE_ID,
  },
  calm_reset: {
    key: "calm_reset",
    displayName: "The Calm Reset",
    founderPriceMinor: 160000,
    fullPriceMinor: null,
    currency: "gbp",
    stripeProductId: undefined,
    stripePriceId: env.STRIPE_CALM_RESET_PRICE_ID,
  },
};

export const membershipConfig = {
  displayName: "Inside the Loop membership",
  priceMinor: 2499,
  currency: "gbp" as const,
  billingInterval: "month" as const,
  includedDays: 30,
};

export function formatMinorAsGbp(minor: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    minor / 100,
  );
}
