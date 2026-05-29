import { getDb } from "@/db/database";
import {
  adoptionApplication,
  adoptionForm,
  adoptionFormAttachment,
} from "@/db/schema";
import {
  ApplicationStatusType,
  CreateAdoptionApplicationSchemaType,
  CreateAdoptionFormAttachmentSchemaType,
  CreateAdoptionFormSchemaType,
} from "@/zod/applications";
import { and, count, desc, eq, isNull, lt } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function createAdoptionApplication(
  data: CreateAdoptionApplicationSchemaType,
) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(adoptionApplication).values({
    id,
    petId: data.petId,
    shelterId: data.shelterId,
    applicantId: data.applicantId,
    status: data.status ?? "submitted",
    notes: data.notes ?? "",
    submittedAt: new Date(),
  });
  return id;
}

export async function getAdoptionApplication(applicationId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(adoptionApplication)
    .where(eq(adoptionApplication.id, applicationId))
    .limit(1);
  return result[0] ?? null;
}

export async function countApplicationsByPet(petId: string) {
  const db = getDb();
  const result = await db
    .select({ value: count() })
    .from(adoptionApplication)
    .where(eq(adoptionApplication.petId, petId));
  return result[0]?.value ?? 0;
}

export async function getApplicationsByShelter(
  shelterId: string,
  submittedBefore?: number,
) {
  const db = getDb();
  const conditions = [eq(adoptionApplication.shelterId, shelterId)];
  if (submittedBefore) {
    conditions.push(lt(adoptionApplication.submittedAt, new Date(submittedBefore)));
  }
  return db
    .select()
    .from(adoptionApplication)
    .where(and(...conditions))
    .orderBy(desc(adoptionApplication.submittedAt))
    .limit(25);
}

export async function getApplicationsByApplicant(applicantId: string) {
  const db = getDb();
  return db
    .select()
    .from(adoptionApplication)
    .where(eq(adoptionApplication.applicantId, applicantId))
    .orderBy(desc(adoptionApplication.submittedAt))
    .limit(25);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatusType,
) {
  const db = getDb();
  await db
    .update(adoptionApplication)
    .set({ status, decidedAt: new Date() })
    .where(eq(adoptionApplication.id, applicationId));
}

export async function finalizeApplication(applicationId: string) {
  const db = getDb();
  await db
    .update(adoptionApplication)
    .set({ finalizedAt: new Date() })
    .where(eq(adoptionApplication.id, applicationId));
}

export async function createAdoptionForm(data: CreateAdoptionFormSchemaType) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(adoptionForm).values({
    id,
    applicationId: data.applicationId,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 ?? null,
    city: data.city,
    region: data.region,
    postalCode: data.postalCode,
    countryCode: data.countryCode,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    googlePlaceId: data.googlePlaceId ?? null,
    formattedAddress: data.formattedAddress ?? null,
    housingType: data.housingType ?? null,
    landlordPermission: data.landlordPermission ?? null,
    hasYard: data.hasYard ?? null,
    householdSize: data.householdSize ?? null,
    hasChildren: data.hasChildren ?? null,
    hasOtherPets: data.hasOtherPets ?? null,
    employmentStatus: data.employmentStatus ?? null,
    extra: data.extra ?? null,
    snapshotAt: new Date(),
  });
  return id;
}

export async function getAdoptionForm(applicationId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(adoptionForm)
    .where(eq(adoptionForm.applicationId, applicationId))
    .limit(1);
  return result[0] ?? null;
}

export async function addFormAttachment(
  data: CreateAdoptionFormAttachmentSchemaType,
) {
  const db = getDb();
  const id = nanoid(12);
  await db.insert(adoptionFormAttachment).values({
    id,
    applicationId: data.applicationId,
    kind: data.kind,
    label: data.label ?? null,
    storageKey: data.storageKey,
    contentType: data.contentType ?? null,
    sizeBytes: data.sizeBytes ?? null,
    requestedAt: new Date(),
    requestedBy: data.requestedBy ?? null,
  });
  return id;
}

export async function markAttachmentUploaded(attachmentId: string) {
  const db = getDb();
  await db
    .update(adoptionFormAttachment)
    .set({ uploadedAt: new Date() })
    .where(eq(adoptionFormAttachment.id, attachmentId));
}

export async function softDeleteAttachment(attachmentId: string) {
  const db = getDb();
  await db
    .update(adoptionFormAttachment)
    .set({ deletedAt: new Date() })
    .where(eq(adoptionFormAttachment.id, attachmentId));
}

// Resolves the applicant that owns an attachment, via its application. Used to
// authorize applicant-scoped attachment mutations. Null when not found.
export async function getAttachmentApplicantId(attachmentId: string) {
  const db = getDb();
  const rows = await db
    .select({ applicantId: adoptionApplication.applicantId })
    .from(adoptionFormAttachment)
    .innerJoin(
      adoptionApplication,
      eq(adoptionApplication.id, adoptionFormAttachment.applicationId),
    )
    .where(eq(adoptionFormAttachment.id, attachmentId))
    .limit(1);
  return rows[0]?.applicantId ?? null;
}

// Resolves the shelter that owns an attachment, via its application. Used to
// authorize shelter-scoped attachment mutations. Null when not found.
export async function getAttachmentShelterId(attachmentId: string) {
  const db = getDb();
  const rows = await db
    .select({ shelterId: adoptionApplication.shelterId })
    .from(adoptionFormAttachment)
    .innerJoin(
      adoptionApplication,
      eq(adoptionApplication.id, adoptionFormAttachment.applicationId),
    )
    .where(eq(adoptionFormAttachment.id, attachmentId))
    .limit(1);
  return rows[0]?.shelterId ?? null;
}

export async function getActiveAttachments(applicationId: string) {
  const db = getDb();
  return db
    .select()
    .from(adoptionFormAttachment)
    .where(
      and(
        eq(adoptionFormAttachment.applicationId, applicationId),
        isNull(adoptionFormAttachment.deletedAt),
      ),
    )
    .orderBy(desc(adoptionFormAttachment.requestedAt));
}
