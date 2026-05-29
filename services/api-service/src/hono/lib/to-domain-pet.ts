import { petSchema, type Pet } from '@repo/domain'
import type { PetRow } from '../env'

/**
 * Maps a raw Drizzle `pet` row (plus its image storage keys) to the public,
 * `@repo/domain`-shaped `Pet` the frontend cards/detail pages consume.
 *
 * The DB and the domain model diverge in a few places:
 *  - location is flat columns here, a nested object in the domain
 *  - listing/adoption status are two columns, one derived `status` in the domain
 *  - images are R2 storage keys; the domain wants resolved URLs
 *  - `createdAt` is a Date (timestamp_ms) here, an ISO string in the domain
 *  - `outOfTown` / `transportAvailable` aren't modeled in the DB (default false)
 */
export function toDomainPet(
  row: PetRow,
  photoKeys: string[],
  assetBase: string,
): Pet {
  const base = assetBase.replace(/\/$/, '')
  const status: Pet['status'] =
    row.adoptionStatus === 'adopted'
      ? 'adopted'
      : row.listingStatus === 'medical_hold'
        ? 'medical'
        : 'available'

  return petSchema.parse({
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed ?? '',
    age: row.age,
    ageLabel: row.ageLabel ?? '',
    gender: row.gender,
    size: row.size,
    location: {
      city: row.city,
      state: row.region,
      zip: row.postalCode ?? undefined,
    },
    photos: photoKeys.map((k) => `${base}/${k}`),
    description: row.description,
    outOfTown: false,
    transportAvailable: false,
    shelterId: row.shelterId,
    status,
    createdAt: row.createdAt.toISOString(),
  })
}

/**
 * Groups image rows by petId, preserving the primary-first / newest-first
 * order they arrive in, and returns just the storage keys per pet.
 */
export function groupPhotoKeys(
  images: { petId: string; storageKey: string }[],
): Map<string, string[]> {
  const byPet = new Map<string, string[]>()
  for (const img of images) {
    const list = byPet.get(img.petId)
    if (list) list.push(img.storageKey)
    else byPet.set(img.petId, [img.storageKey])
  }
  return byPet
}
