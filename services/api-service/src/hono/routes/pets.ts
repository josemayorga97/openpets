import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import * as schema from '@repo/data-utils/schema'
import {
  addPetImage,
  createPet,
  deletePet,
  deletePetImage,
  getAvailablePetsByLocation,
  getPet,
  getPetImages,
  getPetsByShelter,
  updatePet,
} from '@repo/data-utils/queries/pets'
import {
  createPetImageSchema,
  createPetSchema,
  updatePetSchema,
} from '@repo/data-utils/zod-schema/pets'
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
      await deletePet(c.var.pet!.id)
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
      const imageId = await addPetImage({
        ...c.req.valid('json'),
        petId: c.var.pet!.id,
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
      const db = drizzle(c.env.DB, { schema })
      const rows = await db
        .select({ shelterId: schema.pet.shelterId })
        .from(schema.petImage)
        .innerJoin(schema.pet, eq(schema.pet.id, schema.petImage.petId))
        .where(eq(schema.petImage.id, imageId))
        .limit(1)
      const found = rows[0]
      if (!found) return c.json({ error: 'not_found' }, 404)
      if (found.shelterId !== c.var.shelter!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      await deletePetImage(imageId)
      return c.json({ ok: true })
    },
  )
