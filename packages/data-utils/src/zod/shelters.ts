import { z } from "zod";

export const shelterStatusEnum = z.enum(["pending", "active", "suspended"]);

export const shelterSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  status: shelterStatusEnum.default("pending"),
  applicantUserId: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  city: z.string(),
  region: z.string(),
  countryCode: z.string(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  formattedAddress: z.string().nullable().optional(),
  appliedAt: z.number(),
  approvedAt: z.number().nullable().optional(),
});

export const createShelterSchema = shelterSchema.omit({
  approvedAt: true,
  appliedAt: true,
});

export const updateShelterSchema = shelterSchema
  .omit({ id: true, appliedAt: true })
  .partial();

export type ShelterStatusType = z.infer<typeof shelterStatusEnum>;
export type ShelterSchemaType = z.infer<typeof shelterSchema>;
export type CreateShelterSchemaType = z.infer<typeof createShelterSchema>;
export type UpdateShelterSchemaType = z.infer<typeof updateShelterSchema>;
