import { z } from "zod";

export const housingTypeEnum = z.enum(["rent", "own", "family", "other"]);
export const applicationStatusEnum = z.enum([
  "submitted",
  "under_review",
  "approved",
  "finalized",
  "rejected",
  "withdrawn",
  "superseded",
]);
export const attachmentKindEnum = z.enum([
  "photo_id",
  "proof_of_residency",
  "home_photo",
  "vet_reference",
  "landlord_permission",
  "other",
]);

export const adoptionApplicationSchema = z.object({
  id: z.string(),
  petId: z.string(),
  shelterId: z.string(),
  applicantId: z.string(),
  status: applicationStatusEnum.default("submitted"),
  notes: z.string().default(""),
  submittedAt: z.number(),
  decidedAt: z.number().nullable().optional(),
  finalizedAt: z.number().nullable().optional(),
});

export const createAdoptionApplicationSchema = adoptionApplicationSchema.omit({
  id: true,
  submittedAt: true,
  decidedAt: true,
  finalizedAt: true,
});

export const adoptionFormSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable().optional(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  countryCode: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  googlePlaceId: z.string().nullable().optional(),
  formattedAddress: z.string().nullable().optional(),
  housingType: housingTypeEnum.nullable().optional(),
  landlordPermission: z.boolean().nullable().optional(),
  hasYard: z.boolean().nullable().optional(),
  householdSize: z.number().int().nullable().optional(),
  hasChildren: z.boolean().nullable().optional(),
  hasOtherPets: z.boolean().nullable().optional(),
  employmentStatus: z.string().nullable().optional(),
  extra: z.record(z.string(), z.unknown()).nullable().optional(),
  snapshotAt: z.number(),
});

export const createAdoptionFormSchema = adoptionFormSchema.omit({
  id: true,
  snapshotAt: true,
});

export const adoptionFormAttachmentSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  kind: attachmentKindEnum,
  label: z.string().nullable().optional(),
  storageKey: z.string(),
  contentType: z.string().nullable().optional(),
  sizeBytes: z.number().int().nullable().optional(),
  requestedAt: z.number(),
  requestedBy: z.string().nullable().optional(),
  uploadedAt: z.number().nullable().optional(),
  deletedAt: z.number().nullable().optional(),
});

export const createAdoptionFormAttachmentSchema =
  adoptionFormAttachmentSchema.omit({
    id: true,
    requestedAt: true,
    uploadedAt: true,
    deletedAt: true,
  });

export type HousingTypeType = z.infer<typeof housingTypeEnum>;
export type ApplicationStatusType = z.infer<typeof applicationStatusEnum>;
export type AttachmentKindType = z.infer<typeof attachmentKindEnum>;
export type AdoptionApplicationSchemaType = z.infer<
  typeof adoptionApplicationSchema
>;
export type CreateAdoptionApplicationSchemaType = z.infer<
  typeof createAdoptionApplicationSchema
>;
export type AdoptionFormSchemaType = z.infer<typeof adoptionFormSchema>;
export type CreateAdoptionFormSchemaType = z.infer<
  typeof createAdoptionFormSchema
>;
export type AdoptionFormAttachmentSchemaType = z.infer<
  typeof adoptionFormAttachmentSchema
>;
export type CreateAdoptionFormAttachmentSchemaType = z.infer<
  typeof createAdoptionFormAttachmentSchema
>;
