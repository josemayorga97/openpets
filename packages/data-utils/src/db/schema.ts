import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

import { user } from './auth-schema'

// Re-export auth tables so callers can `import { user } from './schema'`.
export * from './auth-schema'

// ---------------------------------------------------------------------------
// Domain — shelters
// The tenant entity. The link to its operator is `applicantUserId`: that
// user submits the shelter and, once an admin approves and grants them
// `role = 'shelter'`, becomes its sole operator. There is no separate
// staff table — one user runs at most one shelter.
// ---------------------------------------------------------------------------

export const shelter = sqliteTable(
  'shelter',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    status: text('status', { enum: ['pending', 'active', 'suspended'] })
      .notNull()
      .default('pending'),
    // Applicant who submitted the shelter request and runs it once approved.
    // Nullable so deleting the user doesn't blow up the row.
    applicantUserId: text('applicant_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    email: text('email'),
    phone: text('phone'),
    city: text('city').notNull(),
    region: text('region').notNull(),
    countryCode: text('country_code').notNull(),
    postalCode: text('postal_code'),
    latitude: real('latitude'),
    longitude: real('longitude'),
    googlePlaceId: text('google_place_id'),
    formattedAddress: text('formatted_address'),
    appliedAt: integer('applied_at', { mode: 'timestamp_ms' }).notNull(),
    approvedAt: integer('approved_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    // One live shelter per applicant. Suspended shelters do not block a
    // fresh application, but pending or active ones do.
    uqApplicantLive: uniqueIndex('uq_shelter_applicant_live')
      .on(t.applicantUserId)
      .where(sql`status in ('pending','active')`),
  }),
)

// ---------------------------------------------------------------------------
// Domain — user profile
// Stable user-level data: standing preferences and COARSE current location.
// Mutable. Distinct from adoption-form snapshots.
// ---------------------------------------------------------------------------

export const userProfile = sqliteTable('user_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  phone: text('phone'),
  countryCode: text('country_code').notNull(),
  region: text('region').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  googlePlaceId: text('google_place_id'),
  formattedAddress: text('formatted_address'),
  preferredSpecies: text('preferred_species', {
    enum: [
      'dog',
      'cat',
      'rabbit',
      'bird',
      'reptile',
      'small_mammal',
      'horse',
      'farm_animal',
      'other',
    ],
  }),
  preferredAge: text('preferred_age', { enum: ['puppy', 'young', 'adult', 'senior'] }),
  preferredSize: text('preferred_size', { enum: ['small', 'medium', 'large', 'xlarge'] }),
  preferredColor: text('preferred_color'),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

// ---------------------------------------------------------------------------
// Domain — pets
// Pet status (available/reserved/adopted) is DERIVED from applications.
// ---------------------------------------------------------------------------

export const pet = sqliteTable(
  'pet',
  {
    id: text('id').primaryKey(),
    shelterId: text('shelter_id')
      .notNull()
      .references(() => shelter.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    species: text('species', {
      enum: [
        'dog',
        'cat',
        'rabbit',
        'bird',
        'reptile',
        'small_mammal',
        'horse',
        'farm_animal',
        'other',
      ],
    }).notNull(),
    breed: text('breed'),
    age: text('age', { enum: ['puppy', 'young', 'adult', 'senior'] }).notNull(),
    ageLabel: text('age_label'),
    gender: text('gender', { enum: ['male', 'female'] }).notNull(),
    size: text('size', { enum: ['small', 'medium', 'large', 'xlarge'] }).notNull(),
    color: text('color'),
    description: text('description').notNull().default(''),
    countryCode: text('country_code').notNull(),
    region: text('region').notNull(),
    city: text('city').notNull(),
    postalCode: text('postal_code'),
    latitude: real('latitude'),
    longitude: real('longitude'),
    listingStatus: text('listing_status', {
      enum: ['draft', 'listed', 'unlisted', 'medical_hold'],
    })
      .notNull()
      .default('draft'),
    adoptionStatus: text('adoption_status', {
      enum: ['available', 'reserved', 'adopted'],
    })
      .notNull()
      .default('available'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => ({
    byShelter: index('idx_pet_shelter').on(t.shelterId),
    byCatalog: index('idx_pet_catalog').on(
      t.countryCode,
      t.region,
      t.city,
      t.listingStatus,
      t.adoptionStatus,
    ),
  }),
)

export const petImage = sqliteTable(
  'pet_image',
  {
    id: text('id').primaryKey(),
    petId: text('pet_id').notNull().references(() => pet.id, { onDelete: 'cascade' }),
    storageKey: text('storage_key').notNull(),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => ({
    byPet: index('idx_pet_image_pet').on(t.petId),
  }),
)

// ---------------------------------------------------------------------------
// Domain — adoption applications
// submitted → under_review → approved → finalized
//   off-ramps: rejected, withdrawn, superseded
// ---------------------------------------------------------------------------

export const adoptionApplication = sqliteTable(
  'adoption_application',
  {
    id: text('id').primaryKey(),
    petId: text('pet_id').notNull().references(() => pet.id, { onDelete: 'restrict' }),
    shelterId: text('shelter_id')
      .notNull()
      .references(() => shelter.id, { onDelete: 'restrict' }),
    applicantId: text('applicant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    status: text('status', {
      enum: [
        'submitted',
        'under_review',
        'approved',
        'finalized',
        'rejected',
        'withdrawn',
        'superseded',
      ],
    })
      .notNull()
      .default('submitted'),
    notes: text('notes').notNull().default(''),
    submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }).notNull(),
    decidedAt: integer('decided_at', { mode: 'timestamp_ms' }),
    finalizedAt: integer('finalized_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    byPet: index('idx_app_pet').on(t.petId),
    byApplicant: index('idx_app_applicant').on(t.applicantId),
    byShelter: index('idx_app_shelter').on(t.shelterId),
  }),
)

// ---------------------------------------------------------------------------
// Domain — adoption forms (snapshot)
// 1:1 with application. Captures household state at submission time.
// Holds full precise address; never edited after submission.
// ---------------------------------------------------------------------------

export const adoptionForm = sqliteTable('adoption_form', {
  id: text('id').primaryKey(),
  applicationId: text('application_id')
    .notNull()
    .unique()
    .references(() => adoptionApplication.id, { onDelete: 'cascade' }),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  region: text('region').notNull(),
  postalCode: text('postal_code').notNull(),
  countryCode: text('country_code').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  googlePlaceId: text('google_place_id'),
  formattedAddress: text('formatted_address'),
  housingType: text('housing_type', { enum: ['rent', 'own', 'family', 'other'] }),
  landlordPermission: integer('landlord_permission', { mode: 'boolean' }),
  hasYard: integer('has_yard', { mode: 'boolean' }),
  householdSize: integer('household_size'),
  hasChildren: integer('has_children', { mode: 'boolean' }),
  hasOtherPets: integer('has_other_pets', { mode: 'boolean' }),
  employmentStatus: text('employment_status'),
  extra: text('extra', { mode: 'json' }).$type<Record<string, unknown>>(),
  snapshotAt: integer('snapshot_at', { mode: 'timestamp_ms' }).notNull(),
})

// Documents requested AFTER shortlisting (per ADR-0003).
export const adoptionFormAttachment = sqliteTable(
  'adoption_form_attachment',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id')
      .notNull()
      .references(() => adoptionApplication.id, { onDelete: 'cascade' }),
    kind: text('kind', {
      enum: [
        'photo_id',
        'proof_of_residency',
        'home_photo',
        'vet_reference',
        'landlord_permission',
        'other',
      ],
    }).notNull(),
    label: text('label'),
    storageKey: text('storage_key').notNull(),
    contentType: text('content_type'),
    sizeBytes: integer('size_bytes'),
    requestedAt: integer('requested_at', { mode: 'timestamp_ms' }).notNull(),
    requestedBy: text('requested_by').references(() => user.id, { onDelete: 'set null' }),
    uploadedAt: integer('uploaded_at', { mode: 'timestamp_ms' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    byApp: index('idx_attachment_app').on(t.applicationId),
  }),
)

// ---------------------------------------------------------------------------
// Domain — sponsorships & contributions
// Sponsor IS a user. Sponsorship is the relationship; contributions are
// individual payment events. No card data — Stripe refs only.
// ---------------------------------------------------------------------------

export const sponsorship = sqliteTable(
  'sponsorship',
  {
    id: text('id').primaryKey(),
    sponsorId: text('sponsor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    petId: text('pet_id').notNull().references(() => pet.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['active', 'paused', 'cancelled'] })
      .notNull()
      .default('active'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    monthlyAmountCents: integer('monthly_amount_cents'),
    currency: text('currency').notNull().default('USD'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
    endedAt: integer('ended_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    bySponsor: index('idx_sponsorship_sponsor').on(t.sponsorId),
    byPet: index('idx_sponsorship_pet').on(t.petId),
    uqSponsorPet: uniqueIndex('uq_sponsorship_sponsor_pet').on(t.sponsorId, t.petId),
  }),
)

export const contribution = sqliteTable(
  'contribution',
  {
    id: text('id').primaryKey(),
    sponsorId: text('sponsor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    petId: text('pet_id').references(() => pet.id, { onDelete: 'set null' }),
    sponsorshipId: text('sponsorship_id').references(() => sponsorship.id, {
      onDelete: 'set null',
    }),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('USD'),
    stripeChargeId: text('stripe_charge_id'),
    stripeInvoiceId: text('stripe_invoice_id'),
    status: text('status', { enum: ['pending', 'succeeded', 'failed', 'refunded'] })
      .notNull()
      .default('pending'),
    occurredAt: integer('occurred_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    bySponsor: index('idx_contribution_sponsor').on(t.sponsorId),
    byPet: index('idx_contribution_pet').on(t.petId),
    bySponsorship: index('idx_contribution_sponsorship').on(t.sponsorshipId),
    byOccurredAt: index('idx_contribution_occurred_at').on(t.occurredAt),
  }),
)

export type Shelter = typeof shelter.$inferSelect
export type UserProfile = typeof userProfile.$inferSelect
export type Pet = typeof pet.$inferSelect
export type PetImage = typeof petImage.$inferSelect
export type AdoptionApplication = typeof adoptionApplication.$inferSelect
export type AdoptionForm = typeof adoptionForm.$inferSelect
export type AdoptionFormAttachment = typeof adoptionFormAttachment.$inferSelect
export type Sponsorship = typeof sponsorship.$inferSelect
export type Contribution = typeof contribution.$inferSelect
