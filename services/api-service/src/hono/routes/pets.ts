import { Hono } from 'hono'
import { z } from 'zod'
import {
  addPetImage,
  createPet,
  deletePet,
  deletePetImage,
  getAvailablePetsByLocation,
  getFeaturedPets,
  getImagesByPetIds,
  getPet,
  getPetImages,
  getPetImageShelterId,
  getPetsByShelter,
  searchAvailablePets,
  updatePet,
} from '@repo/data-utils/queries/pets'
import {
  createPetImageSchema,
  createPetSchema,
  searchPetsSchema,
  updatePetSchema,
} from '@repo/data-utils/zod-schema/pets'
import { countApplicationsByPet } from '@repo/data-utils/queries/applications'
import type { AppEnv, PetRow } from '../env'
import {
  requireMyShelter,
  requirePetOwner,
  requireRole,
  requireSession,
  requireShelterOwner,
} from '../middleware/auth'
import { zJson, zQuery } from '../middleware/validate'
import { groupPhotoKeys, toPublicPet } from '../lib/to-public-pet'

// Batch-loads images for a set of rows and composes each into a PublicPet,
// resolving storage keys to absolute URLs against the public asset base.
async function composePets(rows: PetRow[], assetBase: string) {
  if (rows.length === 0) return []
  const images = await getImagesByPetIds(rows.map((r) => r.id))
  const byPet = groupPhotoKeys(images)
  return rows.map((row) => toPublicPet(row, byPet.get(row.id) ?? [], assetBase))
}

const beforeQuery = z.object({
  createdBefore: z.coerce.number().optional(),
})

const locationQuery = z.object({
  countryCode: z.string().min(1),
  region: z.string().min(1),
  city: z.string().min(1),
  createdBefore: z.coerce.number().optional(),
})

const createImageBody = createPetImageSchema.omit({ petId: true })
const createPetBody = createPetSchema.omit({ shelterId: true })

export const petsRouter = new Hono<AppEnv>()
  .post(
    '/',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zJson(createPetBody),
    async (c) => {
      const id = await createPet({
        ...c.req.valid('json'),
        shelterId: c.var.shelter!.id,
      })
      return c.json({ id })
    },
  )
  .get('/available', zQuery(locationQuery), async (c) => {
    const { countryCode, region, city, createdBefore } = c.req.valid('query')
    const rows = await getAvailablePetsByLocation(
      { countryCode, region, city },
      createdBefore,
    )
    const nextCursor =
      rows.length === 25 ? rows[rows.length - 1]!.createdAt.getTime() : null
    const items = await composePets(rows, c.env.PUBLIC_ASSET_BASE_URL)
    return c.json({ items, nextCursor })
  })
  // Public home-page rail — newest listed/available pets, no auth or location.
  .get('/featured', async (c) => {
    const rows = await getFeaturedPets()
    const items = await composePets(rows, c.env.PUBLIC_ASSET_BASE_URL)
    return c.json({ items })
  })
  // Public catalog search with filters + pagination.
  .get('/search', zQuery(searchPetsSchema), async (c) => {
    const { rows, total, page, pageSize } = await searchAvailablePets(
      c.req.valid('query'),
    )
    const results = await composePets(rows, c.env.PUBLIC_ASSET_BASE_URL)
    return c.json({ results, total, page, pageSize })
  })
  .get(
    '/by-shelter/:shelterId',
    requireSession,
    requireRole('shelter'),
    requireShelterOwner,
    zQuery(beforeQuery),
    async (c) => {
      const { createdBefore } = c.req.valid('query')
      const rows = await getPetsByShelter(c.var.shelter!.id, createdBefore)
      const nextCursor =
        rows.length === 25 ? rows[rows.length - 1]!.createdAt.getTime() : null
      const items = await composePets(rows, c.env.PUBLIC_ASSET_BASE_URL)
      return c.json({ items, nextCursor })
    },
  )
  .get('/:id', async (c) => {
    const row = await getPet(c.req.param('id'))
    if (!row) return c.json({ error: 'not_found' }, 404)
    const images = await getPetImages(row.id)
    return c.json(
      toPublicPet(
        row,
        images.map((i) => i.storageKey),
        c.env.PUBLIC_ASSET_BASE_URL,
      ),
    )
  })
  .patch(
    '/:id',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    requirePetOwner,
    zJson(updatePetSchema),
    async (c) => {
      await updatePet(c.var.pet!.id, c.req.valid('json'))
      return c.json({ ok: true })
    },
  )
  .delete(
    '/:id',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    requirePetOwner,
    async (c) => {
      const petId = c.var.pet!.id
      // adoptionApplication.petId is onDelete: 'restrict', so deleting a pet
      // that still has applications would raise an FK error (500). Surface a
      // clear 409 instead.
      const applications = await countApplicationsByPet(petId)
      if (applications > 0) {
        return c.json(
          { error: 'has_applications', applications },
          409,
        )
      }
      await deletePet(petId)
      return c.json({ ok: true })
    },
  )
  .post(
    '/:id/images',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    requirePetOwner,
    zJson(createImageBody),
    async (c) => {
      const petId = c.req.param('id');
      const imageId = await addPetImage({
        ...c.req.valid('json'),
        petId
      })
      return c.json({ id: imageId })
    },
  )
  .get('/:id/images', async (c) => {
    const items = await getPetImages(c.req.param('id'))
    return c.json({ items })
  })
  .delete(
    '/images/:imageId',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    async (c) => {
      const imageId = c.req.param('imageId')
      const shelterId = await getPetImageShelterId(imageId)
      if (!shelterId) return c.json({ error: 'not_found' }, 404)
      if (shelterId !== c.var.shelter!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      await deletePetImage(imageId)
      return c.json({ ok: true })
    },
  )
