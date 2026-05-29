import { z } from "zod";

export const sponsorshipStatusEnum = z.enum(["active", "paused", "cancelled"]);
export const contributionStatusEnum = z.enum([
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export const sponsorshipSchema = z.object({
  id: z.string(),
  sponsorId: z.string(),
  petId: z.string(),
  status: sponsorshipStatusEnum.default("active"),
  stripeSubscriptionId: z.string().nullable().optional(),
  monthlyAmountCents: z.number().int().nullable().optional(),
  currency: z.string().default("USD"),
  startedAt: z.number(),
  endedAt: z.number().nullable().optional(),
});

export const createSponsorshipSchema = sponsorshipSchema.omit({
  id: true,
  startedAt: true,
  endedAt: true,
});

export const contributionSchema = z.object({
  id: z.string(),
  sponsorId: z.string(),
  petId: z.string().nullable().optional(),
  sponsorshipId: z.string().nullable().optional(),
  amountCents: z.number().int(),
  currency: z.string().default("USD"),
  stripeChargeId: z.string().nullable().optional(),
  stripeInvoiceId: z.string().nullable().optional(),
  status: contributionStatusEnum.default("pending"),
  occurredAt: z.number(),
  createdAt: z.number(),
});

export const createContributionSchema = contributionSchema.omit({
  id: true,
  createdAt: true,
});

export type SponsorshipStatusType = z.infer<typeof sponsorshipStatusEnum>;
export type ContributionStatusType = z.infer<typeof contributionStatusEnum>;
export type SponsorshipSchemaType = z.infer<typeof sponsorshipSchema>;
export type CreateSponsorshipSchemaType = z.infer<
  typeof createSponsorshipSchema
>;
export type ContributionSchemaType = z.infer<typeof contributionSchema>;
export type CreateContributionSchemaType = z.infer<
  typeof createContributionSchema
>;
