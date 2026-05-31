import type {
  AgeType,
  GenderType,
  SizeType,
  SpeciesType,
} from '@repo/data-utils/zod-schema/pets'
import type { PetRow } from '../env'

/**
 * The single public, frontend-facing shape for a pet. Every pet-returning
 * route composes raw Drizzle rows into this shape via `toPublicPet`, so the UI
 * sees one consistent model everywhere and the RPC-inferred type flows from
 * here into the apps.
 *
 * The DB row and this view-model diverge in a few places:
 *  - location is flat columns in the row, a nested object here
 *  - listing/adoption status are two columns, one derived `status` here
 *  - images are R2 storage keys; here they're resolved absolute URLs
 *  - `createdAt` is a Date in the row, an ISO string here (RPC serializes
 *    Date→string over JSON anyway, so we emit a string on both sides)
 *  - `outOfTown` / `transportAvailable` aren't modeled in the DB (always false)
 */
export interface PublicPet {
  id: string
  name: string
  species: SpeciesType
  breed: string
  age: AgeType
  ageLabel: string
  gender: GenderType
  size: SizeType
  location: {
    city: string
    state: string
    zip?: string
    distanceMiles?: number
  }
  photos: string[]
  description: string
  outOfTown: boolean
  transportAvailable: boolean
  shelterId: string
  status: 'available' | 'medical' | 'adopted'
  createdAt: string
}

export function toPublicPet(
  row: PetRow,
  photoKeys: string[],
  assetBase: string,
): PublicPet {
  const base = assetBase.replace(/\/$/, '')
  const status: PublicPet['status'] =
    row.adoptionStatus === 'adopted'
      ? 'adopted'
      : row.listingStatus === 'medical_hold'
        ? 'medical'
        : 'available'

  return {
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
  }
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
