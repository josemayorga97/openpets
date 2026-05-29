import { getDb } from "@/db/database";
import { shelter, user } from "@/db/schema";
import {
  CreateShelterSchemaType,
  UpdateShelterSchemaType,
} from "@/zod/shelters";
import { and, desc, eq } from "drizzle-orm";

export async function createShelter(
  data: CreateShelterSchemaType & { id: string },
) {
  const db = getDb();
  await db.insert(shelter).values({
    id: data.id,
    name: data.name,
    slug: data.slug,
    status: data.status ?? "pending",
    applicantUserId: data.applicantUserId ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    city: data.city,
    region: data.region,
    countryCode: data.countryCode,
    postalCode: data.postalCode ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    googlePlaceId: data.googlePlaceId ?? null,
    formattedAddress: data.formattedAddress ?? null,
    appliedAt: new Date(),
  });
  return data.id;
}

export async function getShelter(shelterId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(shelter)
    .where(eq(shelter.id, shelterId))
    .limit(1);
  return result[0] ?? null;
}

export async function getSheltersByStatus(
  status: "pending" | "active" | "suspended",
) {
  const db = getDb();
  return db
    .select()
    .from(shelter)
    .where(eq(shelter.status, status))
    .orderBy(desc(shelter.appliedAt))
    .limit(50);
}

export async function updateShelter(
  shelterId: string,
  data: UpdateShelterSchemaType,
) {
  const db = getDb();
  const { approvedAt, ...rest } = data;
  await db
    .update(shelter)
    .set({
      ...rest,
      ...(approvedAt != null ? { approvedAt: new Date(approvedAt) } : {}),
    })
    .where(eq(shelter.id, shelterId));
}

export type ApproveShelterResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "not_pending" | "no_applicant" };

// Approving a shelter activates the shelter row and bumps the applicant's
// auth role to 'shelter'. Both writes must land together; D1's batch()
// makes a partial state impossible.
export async function approveShelter(
  shelterId: string,
): Promise<ApproveShelterResult> {
  const db = getDb();
  const existing = await getShelter(shelterId);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.status !== "pending") {
    return { ok: false, reason: "not_pending" };
  }
  if (!existing.applicantUserId) {
    return { ok: false, reason: "no_applicant" };
  }

  const now = new Date();
  const dbAny = db as unknown as {
    batch: (qs: unknown[]) => Promise<unknown>;
  };
  await dbAny.batch([
    db
      .update(shelter)
      .set({ status: "active", approvedAt: now })
      .where(and(eq(shelter.id, shelterId), eq(shelter.status, "pending"))),
    db
      .update(user)
      .set({ role: "shelter", updatedAt: now })
      .where(eq(user.id, existing.applicantUserId)),
  ]);
  return { ok: true };
}

export async function setShelterStatus(
  shelterId: string,
  status: "active" | "suspended",
) {
  const db = getDb();
  await db
    .update(shelter)
    .set({ status })
    .where(eq(shelter.id, shelterId));
}

// The shelter a user runs is the row where they are the applicant. The
// `uq_shelter_applicant_live` partial index guarantees at most one
// pending/active shelter per applicant, so .limit(1) is well-defined.
export async function getShelterForOperator(userId: string) {
  const db = getDb();
  const rows = await db
    .select({
      shelterId: shelter.id,
      shelterStatus: shelter.status,
    })
    .from(shelter)
    .where(eq(shelter.applicantUserId, userId))
    .limit(1);
  return rows[0] ?? null;
}
