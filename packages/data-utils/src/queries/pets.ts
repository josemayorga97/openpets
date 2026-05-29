import { getDb } from "@/db/database";
import { pet, petImage } from "@/db/schema";
import {
  CreatePetImageSchemaType,
  CreatePetSchemaType,
  UpdatePetSchemaType,
} from "@/zod/pets";
import { and, desc, eq, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createPet(data: CreatePetSchemaType) {
  const db = getDb();
  const id = nanoid(12);
  const now = new Date();
  await db.insert(pet).values({
    id,
    shelterId: data.shelterId,
    name: data.name,
    species: data.species,
    breed: data.breed ?? null,
    age: data.age,
    ageLabel: data.ageLabel ?? null,
    gender: data.gender,
    size: data.size,
    color: data.color ?? null,
    description: data.description ?? "",
    countryCode: data.countryCode,
    region: data.region,
    city: data.city,
    postalCode: data.postalCode ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    listingStatus: data.listingStatus ?? "draft",
    adoptionStatus: data.adoptionStatus ?? "available",
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function getPet(petId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(pet)
    .where(eq(pet.id, petId))
    .limit(1);
  return result[0] ?? null;
}

export async function getPetsByShelter(
  shelterId: string,
  createdBefore?: number,
) {
  const db = getDb();
  const conditions = [eq(pet.shelterId, shelterId)];
  if (createdBefore) {
    conditions.push(lt(pet.createdAt, new Date(createdBefore)));
  }
  return db
    .select()
    .from(pet)
    .where(and(...conditions))
    .orderBy(desc(pet.createdAt))
    .limit(25);
}

export async function getAvailablePetsByLocation(
  location: { countryCode: string; region: string; city: string },
  createdBefore?: number,
) {
  const db = getDb();
  const conditions = [
    eq(pet.countryCode, location.countryCode),
    eq(pet.region, location.region),
    eq(pet.city, location.city),
    eq(pet.listingStatus, "listed"),
    eq(pet.adoptionStatus, "available"),
  ];
  if (createdBefore) {
    conditions.push(lt(pet.createdAt, new Date(createdBefore)));
  }
  return db
    .select()
    .from(pet)
    .where(and(...conditions))
    .orderBy(desc(pet.createdAt))
    .limit(25);
}

export async function updatePet(petId: string, data: UpdatePetSchemaType) {
  const db = getDb();
  await db
    .update(pet)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pet.id, petId));
}

export async function deletePet(petId: string) {
  const db = getDb();
  await db.delete(pet).where(eq(pet.id, petId));
}

export async function addPetImage(data: CreatePetImageSchemaType) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(petImage).values({
    id,
    petId: data.petId,
    storageKey: data.storageKey,
    isPrimary: data.isPrimary ?? false,
    createdAt: new Date(),
  });
  return id;
}

export async function getPetImages(petId: string) {
  const db = getDb();
  return db
    .select()
    .from(petImage)
    .where(eq(petImage.petId, petId))
    .orderBy(desc(petImage.isPrimary), desc(petImage.createdAt));
}

export async function deletePetImage(imageId: string) {
  const db = getDb();
  await db.delete(petImage).where(eq(petImage.id, imageId));
}
