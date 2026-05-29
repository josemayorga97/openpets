import { Hono } from 'hono'
import { z } from 'zod'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '@repo/data-utils/schema'
import {
  addPetImage,
  createPet,
  deletePet,
  deletePetImage,
  getPet,
  getPetsByShelter,
  updatePet,
} from '@repo/data-utils/queries/pets'
import {
  addFormAttachment,
  finalizeApplication,
  getActiveAttachments,
  getAdoptionApplication,
  getApplicationsByShelter,
  softDeleteAttachment,
  updateApplicationStatus,
} from '@repo/data-utils/queries/applications'
import {
  getShelter,
  getShelterForOperator,
  updateShelter,
} from '@repo/data-utils/queries/shelters'
import {
  createPetImageSchema,
  createPetSchema,
  updatePetSchema,
} from '@repo/data-utils/zod-schema/pets'
import {
  applicationStatusEnum,
  createAdoptionFormAttachmentSchema,
} from '@repo/data-utils/zod-schema/applications'
import { updateShelterSchema } from '@repo/data-utils/zod-schema/shelters'
import type { AppEnv } from '../env'
import {
  requireMyShelter,
  requirePetOwner,
  requireRole,
  requireSession,
} from '../middleware/auth'
import { zJson, zQuery } from '../middleware/validate'

const beforeQuery = z.object({
  createdBefore: z.coerce.number().optional(),
})

const submittedBeforeQuery = z.object({
  submittedBefore: z.coerce.number().optional(),
})

// shelterId is implied by the session; clients shouldn't send it.
const createPetBody = createPetSchema.omit({ shelterId: true })

const createAttachmentBody = createAdoptionFormAttachmentSchema.omit({
  applicationId: true,
  requestedBy: true,
})

export const meRouter = new Hono<AppEnv>()
  // GET own shelter regardless of status — the dashboard renders "pending"
  // and "suspended" states differently than "active".
  .get('/shelter', requireSession, async (c) => {
    const row = await getShelterForOperator(c.var.user!.id)
    if (!row) return c.json({ error: 'not_found' }, 404)
    const full = await getShelter(row.shelterId)
    if (!full) return c.json({ error: 'not_found' }, 404)
    return c.json(full)
  })
  .patch(
    '/shelter',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zJson(updateShelterSchema),
    async (c) => {
      await updateShelter(c.var.shelter!.id, c.req.valid('json'))
      return c.json({ ok: true })
    },
  )

  // Pets owned by the caller's shelter.
  .get(
    '/pets',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zQuery(beforeQuery),
    async (c) => {
      const { createdBefore } = c.req.valid('query')
      const items = await getPetsByShelter(c.var.shelter!.id, createdBefore)
      const nextCursor =
        items.length === 25 ? items[items.length - 1]!.createdAt.getTime() : null
      return c.json({ items, nextCursor })
    },
  )
  .post(
    '/pets',
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
  .patch(
    '/pets/:id',
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
    '/pets/:id',
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
    '/pets/:id/images',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    requirePetOwner,
    zJson(createPetImageSchema.omit({ petId: true })),
    async (c) => {
      const imageId = await addPetImage({
        ...c.req.valid('json'),
        petId: c.var.pet!.id,
      })
      return c.json({ id: imageId })
    },
  )
  .delete(
    '/pets/images/:imageId',
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
  })

  // Applications addressed to the caller's shelter.
  .get(
    '/applications',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zQuery(submittedBeforeQuery),
    async (c) => {
      const { submittedBefore } = c.req.valid('query')
      const items = await getApplicationsByShelter(
        c.var.shelter!.id,
        submittedBefore,
      )
      const nextCursor =
        items.length === 25
          ? items[items.length - 1]!.submittedAt.getTime()
          : null
      return c.json({ items, nextCursor })
    },
  )
  .get(
    '/applications/:id',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    async (c) => {
    const row = await getAdoptionApplication(c.req.param('id'))
    if (!row) return c.json({ error: 'not_found' }, 404)
    if (row.shelterId !== c.var.shelter!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    return c.json(row)
  })
  .patch(
    '/applications/:id/status',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zJson(z.object({ status: applicationStatusEnum })),
    async (c) => {
      const id = c.req.param('id')
      const app = await getAdoptionApplication(id)
      if (!app) return c.json({ error: 'not_found' }, 404)
      if (app.shelterId !== c.var.shelter!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      await updateApplicationStatus(id, c.req.valid('json').status)
      return c.json({ ok: true })
    },
  )
  .post(
    '/applications/:id/finalize',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    async (c) => {
    const id = c.req.param('id')
    const app = await getAdoptionApplication(id)
    if (!app) return c.json({ error: 'not_found' }, 404)
    if (app.shelterId !== c.var.shelter!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    await finalizeApplication(id)
    return c.json({ ok: true })
  })
  .post(
    '/applications/:id/attachments',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    zJson(createAttachmentBody),
    async (c) => {
      const id = c.req.param('id')
      const app = await getAdoptionApplication(id)
      if (!app) return c.json({ error: 'not_found' }, 404)
      if (app.shelterId !== c.var.shelter!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      const attachmentId = await addFormAttachment({
        ...c.req.valid('json'),
        applicationId: id,
        requestedBy: c.var.user!.id,
      })
      return c.json({ id: attachmentId })
    },
  )
  .get(
    '/applications/:id/attachments',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    async (c) => {
    const id = c.req.param('id')
    const app = await getAdoptionApplication(id)
    if (!app) return c.json({ error: 'not_found' }, 404)
    if (app.shelterId !== c.var.shelter!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    const items = await getActiveAttachments(id)
    return c.json({ items })
  })
  .delete(
    '/applications/attachments/:attachmentId',
    requireSession,
    requireRole('shelter'),
    requireMyShelter,
    async (c) => {
      const attachmentId = c.req.param('attachmentId')
      const db = drizzle(c.env.DB, { schema })
      const rows = await db
        .select({ shelterId: schema.adoptionApplication.shelterId })
        .from(schema.adoptionFormAttachment)
        .innerJoin(
          schema.adoptionApplication,
          eq(
            schema.adoptionApplication.id,
            schema.adoptionFormAttachment.applicationId,
          ),
        )
        .where(eq(schema.adoptionFormAttachment.id, attachmentId))
        .limit(1)
      const found = rows[0]
      if (!found) return c.json({ error: 'not_found' }, 404)
      if (found.shelterId !== c.var.shelter!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      await softDeleteAttachment(attachmentId)
      return c.json({ ok: true })
    },
  )
