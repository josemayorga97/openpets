import { Hono } from 'hono'
import { z } from 'zod'
import {
  addPetImage,
  createPet,
  deletePet,
  deletePetImage,
  getAvailablePetsByLocation,
  getPet,
  getPetImages,
  getPetImageShelterId,
  getPetsByShelter,
  updatePet,
} from '@repo/data-utils/queries/pets'
import {
  createPetImageSchema,
  createPetSchema,
  updatePetSchema,
} from '@repo/data-utils/zod-schema/pets'
import { countApplicationsByPet } from '@repo/data-utils/queries/applications'
import type { AppEnv } from '../env'
import {
  requireMyShelter,
  requirePetOwner,
  requireRole,
  requireSession,
  requireShelterOwner,
} from '../middleware/auth'
import { zJson, zQuery } from '../middleware/validate'

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
    const items = await getAvailablePetsByLocation(
      { countryCode, region, city },
      createdBefore,
    )
    const nextCursor =
      items.length === 25 ? items[items.length - 1]!.createdAt.getTime() : null
    return c.json({ items, nextCursor })
  })
  .get(
    '/by-shelter/:shelterId',
    requireSession,
    requireRole('shelter'),
    requireShelterOwner,
    zQuery(beforeQuery),
    async (c) => {
      const { createdBefore } = c.req.valid('query')
      const items = await getPetsByShelter(c.var.shelter!.id, createdBefore)
      const nextCursor =
        items.length === 25 ? items[items.length - 1]!.createdAt.getTime() : null
      return c.json({ items, nextCursor })
    },
  )
  .get('/:id', async (c) => {
    const row = await getPet(c.req.param('id'))
    if (!row) return c.json({ error: 'not_found' }, 404)
    return c.json(row)
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
