import { getDb } from "@/db/database";
import { userProfile } from "@/db/schema";
import { UpsertUserProfileSchemaType } from "@/zod/users";
import { eq } from "drizzle-orm";

export async function getUserProfile(userId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertUserProfile(data: UpsertUserProfileSchemaType) {
  const db = getDb();
  const now = new Date();
  const existing = await getUserProfile(data.userId);
  if (existing) {
    await db
      .update(userProfile)
      .set({ ...data, updatedAt: now })
      .where(eq(userProfile.userId, data.userId));
    return data.userId;
  }
  await db.insert(userProfile).values({
    userId: data.userId,
    phone: data.phone ?? null,
    countryCode: data.countryCode,
    region: data.region,
    city: data.city,
    postalCode: data.postalCode ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    googlePlaceId: data.googlePlaceId ?? null,
    formattedAddress: data.formattedAddress ?? null,
    preferredSpecies: data.preferredSpecies ?? null,
    preferredAge: data.preferredAge ?? null,
    preferredSize: data.preferredSize ?? null,
    preferredColor: data.preferredColor ?? null,
    updatedAt: now,
  });
  return data.userId;
}
