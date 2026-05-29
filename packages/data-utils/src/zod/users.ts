import { z } from "zod";
import { ageEnum, sizeEnum, speciesEnum } from "./pets";

export const userRoleEnum = z.enum(["admin", "shelter", "user"]);

export const userProfileSchema = z.object({
  userId: z.string(),
  phone: z.string().nullable().optional(),
  countryCode: z.string(),
  region: z.string(),
  city: z.string(),
  postalCode: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  formattedAddress: z.string().nullable().optional(),
  preferredSpecies: speciesEnum.nullable().optional(),
  preferredAge: ageEnum.nullable().optional(),
  preferredSize: sizeEnum.nullable().optional(),
  preferredColor: z.string().nullable().optional(),
  updatedAt: z.number(),
});

export const upsertUserProfileSchema = userProfileSchema.omit({
  updatedAt: true,
});

export type UserRoleType = z.infer<typeof userRoleEnum>;
export type UserProfileSchemaType = z.infer<typeof userProfileSchema>;
export type UpsertUserProfileSchemaType = z.infer<
  typeof upsertUserProfileSchema
>;
