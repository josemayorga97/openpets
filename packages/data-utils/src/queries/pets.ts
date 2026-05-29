import { getDb } from "@/db/database";
import { pet, petImage } from "@/db/schema";
import {
  AgeType,
  CreatePetImageSchemaType,
  CreatePetSchemaType,
  SizeType,
  SpeciesType,
  UpdatePetSchemaType,
} from "@/zod/pets";
import { and, asc, count, desc, eq, inArray, like, lt, or } from "drizzle-orm";
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

// Resolves the shelter that owns a pet image, via the image's pet. Used to
// authorize shelter-scoped image mutations. Returns null when the image
// (or its pet) doesn't exist.
export async function getPetImageShelterId(imageId: string) {
  const db = getDb();
  const rows = await db
    .select({ shelterId: pet.shelterId })
    .from(petImage)
    .innerJoin(pet, eq(pet.id, petImage.petId))
    .where(eq(petImage.id, imageId))
    .limit(1);
  return rows[0]?.shelterId ?? null;
}

// ---------------------------------------------------------------------------
// Public catalog reads — power the unauthenticated browse surface (home,
// search, pet detail). Only pets that are publicly listed AND still available
// are exposed.
// ---------------------------------------------------------------------------

const PUBLIC_BASE = [
  eq(pet.listingStatus, "listed"),
  eq(pet.adoptionStatus, "available"),
] as const;

export async function getFeaturedPets(limit = 4) {
  const db = getDb();
  return db
    .select()
    .from(pet)
    .where(and(...PUBLIC_BASE))
    .orderBy(desc(pet.createdAt))
    .limit(limit);
}

export type SearchPetsFilters = {
  species?: SpeciesType;
  breeds?: string[];
  ages?: AgeType[];
  sizes?: SizeType[];
  // 'nearest' is treated as 'newest' — no server-side geo ranking yet.
  sort?: "nearest" | "newest" | "oldest";
  page?: number;
  pageSize?: number;
};

export async function searchAvailablePets(filters: SearchPetsFilters) {
  const db = getDb();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, filters.pageSize ?? 12));

  const conditions = [...PUBLIC_BASE];
  if (filters.species) conditions.push(eq(pet.species, filters.species));
  if (filters.ages && filters.ages.length > 0) {
    conditions.push(inArray(pet.age, filters.ages));
  }
  if (filters.sizes && filters.sizes.length > 0) {
    conditions.push(inArray(pet.size, filters.sizes));
  }
  if (filters.breeds && filters.breeds.length > 0) {
    // Substring match per breed, OR'd together — mirrors the mock client.
    const breedMatch = or(...filters.breeds.map((b) => like(pet.breed, `%${b}%`)));
    if (breedMatch) conditions.push(breedMatch);
  }
  const where = and(...conditions);

  // 'distance', free-text 'location' and 'includeOutOfTown' are intentionally
  // not applied here — the DB has no geo distance or out-of-town concept.
  const order = filters.sort === "oldest" ? asc(pet.createdAt) : desc(pet.createdAt);

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(pet)
      .where(where)
      .orderBy(order)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(pet).where(where),
  ]);

  return { rows, total: totalRows[0]?.value ?? 0, page, pageSize };
}

export async function getImagesByPetIds(petIds: string[]) {
  if (petIds.length === 0) return [];
  const db = getDb();
  return db
    .select({
      petId: petImage.petId,
      storageKey: petImage.storageKey,
      isPrimary: petImage.isPrimary,
    })
    .from(petImage)
    .where(inArray(petImage.petId, petIds))
    .orderBy(desc(petImage.isPrimary), desc(petImage.createdAt));
}
