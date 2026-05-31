import { z } from "zod";

export const speciesEnum = z.enum([
  "dog",
  "cat",
  "rabbit",
  "bird",
  "reptile",
  "small_mammal",
  "horse",
  "farm_animal",
  "other",
]);

export const ageEnum = z.enum(["puppy", "young", "adult", "senior"]);
export const genderEnum = z.enum(["male", "female"]);
export const sizeEnum = z.enum(["small", "medium", "large", "xlarge"]);
export const listingStatusEnum = z.enum([
  "draft",
  "listed",
  "unlisted",
  "medical_hold",
]);
export const adoptionStatusEnum = z.enum(["available", "reserved", "adopted"]);

export const petSchema = z.object({
  id: z.string(),
  shelterId: z.string(),
  name: z.string().min(1).max(100),
  species: speciesEnum,
  breed: z.string().nullable().optional(),
  age: ageEnum,
  ageLabel: z.string().nullable().optional(),
  gender: genderEnum,
  size: sizeEnum,
  color: z.string().nullable().optional(),
  description: z.string().default(""),
  countryCode: z.string(),
  region: z.string(),
  city: z.string(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  listingStatus: listingStatusEnum.default("draft"),
  adoptionStatus: adoptionStatusEnum.default("available"),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const createPetSchema = petSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePetSchema = petSchema
  .omit({ id: true, shelterId: true, createdAt: true, updatedAt: true })
  .partial();

export const petImageSchema = z.object({
  id: z.string(),
  petId: z.string(),
  storageKey: z.string(),
  isPrimary: z.boolean().default(false),
  createdAt: z.number(),
});

export const createPetImageSchema = petImageSchema.omit({
  id: true,
  createdAt: true,
});

// Validator for the public catalog search. Mirrors `SearchPetsFilters` in
// queries/pets.ts — shared by the `/pets/search` route and the user app's
// search server fn so the wire shape can't drift from the query shape.
export const searchPetsSchema = z.object({
  species: speciesEnum.optional(),
  breeds: z.array(z.string()).optional(),
  ages: z.array(ageEnum).optional(),
  sizes: z.array(sizeEnum).optional(),
  sort: z.enum(["nearest", "newest", "oldest"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(60).optional(),
});

export type SpeciesType = z.infer<typeof speciesEnum>;
export type AgeType = z.infer<typeof ageEnum>;
export type GenderType = z.infer<typeof genderEnum>;
export type SizeType = z.infer<typeof sizeEnum>;
export type ListingStatusType = z.infer<typeof listingStatusEnum>;
export type AdoptionStatusType = z.infer<typeof adoptionStatusEnum>;
export type PetSchemaType = z.infer<typeof petSchema>;
export type CreatePetSchemaType = z.infer<typeof createPetSchema>;
export type UpdatePetSchemaType = z.infer<typeof updatePetSchema>;
export type PetImageSchemaType = z.infer<typeof petImageSchema>;
export type CreatePetImageSchemaType = z.infer<typeof createPetImageSchema>;
export type SearchPetsSchemaType = z.infer<typeof searchPetsSchema>;
