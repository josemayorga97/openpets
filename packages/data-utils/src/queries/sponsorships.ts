import { getDb } from "@/db/database";
import { contribution, sponsorship } from "@/db/schema";
import {
  ContributionStatusType,
  CreateContributionSchemaType,
  CreateSponsorshipSchemaType,
  SponsorshipStatusType,
} from "@/zod/sponsorships";
import { and, desc, eq, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createSponsorship(data: CreateSponsorshipSchemaType) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(sponsorship).values({
    id,
    sponsorId: data.sponsorId,
    petId: data.petId,
    status: data.status ?? "active",
    stripeSubscriptionId: data.stripeSubscriptionId ?? null,
    monthlyAmountCents: data.monthlyAmountCents ?? null,
    currency: data.currency ?? "USD",
    startedAt: new Date(),
  });
  return id;
}

export async function getSponsorship(sponsorshipId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(sponsorship)
    .where(eq(sponsorship.id, sponsorshipId))
    .limit(1);
  return result[0] ?? null;
}

export async function getSponsorshipsBySponsor(sponsorId: string) {
  const db = getDb();
  return db
    .select()
    .from(sponsorship)
    .where(eq(sponsorship.sponsorId, sponsorId))
    .orderBy(desc(sponsorship.startedAt));
}

export async function getSponsorshipsByPet(petId: string) {
  const db = getDb();
  return db
    .select()
    .from(sponsorship)
    .where(eq(sponsorship.petId, petId))
    .orderBy(desc(sponsorship.startedAt));
}

export async function updateSponsorshipStatus(
  sponsorshipId: string,
  status: SponsorshipStatusType,
) {
  const db = getDb();
  const patch: { status: SponsorshipStatusType; endedAt?: Date } = {
    status,
  };
  if (status === "cancelled") {
    patch.endedAt = new Date();
  }
  await db
    .update(sponsorship)
    .set(patch)
    .where(eq(sponsorship.id, sponsorshipId));
}

export async function recordContribution(data: CreateContributionSchemaType) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(contribution).values({
    id,
    sponsorId: data.sponsorId,
    petId: data.petId ?? null,
    sponsorshipId: data.sponsorshipId ?? null,
    amountCents: data.amountCents,
    currency: data.currency ?? "USD",
    stripeChargeId: data.stripeChargeId ?? null,
    stripeInvoiceId: data.stripeInvoiceId ?? null,
    status: data.status ?? "pending",
    occurredAt: new Date(data.occurredAt),
  });
  return id;
}

export async function updateContributionStatus(
  contributionId: string,
  status: ContributionStatusType,
) {
  const db = getDb();
  await db
    .update(contribution)
    .set({ status })
    .where(eq(contribution.id, contributionId));
}

export async function getContributionsBySponsor(
  sponsorId: string,
  occurredBefore?: number,
) {
  const db = getDb();
  const conditions = [eq(contribution.sponsorId, sponsorId)];
  if (occurredBefore) {
    conditions.push(lt(contribution.occurredAt, new Date(occurredBefore)));
  }
  return db
    .select()
    .from(contribution)
    .where(and(...conditions))
    .orderBy(desc(contribution.occurredAt))
    .limit(25);
}

export async function getContributionsBySponsorship(sponsorshipId: string) {
  const db = getDb();
  return db
    .select()
    .from(contribution)
    .where(eq(contribution.sponsorshipId, sponsorshipId))
    .orderBy(desc(contribution.occurredAt));
}
