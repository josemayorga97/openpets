import { Hono } from 'hono'
import { z } from 'zod'
import {
  approveShelter,
  getSheltersByStatus,
  setShelterStatus,
  getShelter,
  updateShelter,
} from '@repo/data-utils/queries/shelters'
import {
  deletePet,
  getImagesByPetIds,
  getPetsByShelter,
  updatePet,
} from '@repo/data-utils/queries/pets'
import {
  getApplicationsByShelter,
  updateApplicationStatus,
} from '@repo/data-utils/queries/applications'
import {
  recordContribution,
  updateContributionStatus,
} from '@repo/data-utils/queries/sponsorships'
import {
  shelterStatusEnum,
  updateShelterSchema,
} from '@repo/data-utils/zod-schema/shelters'
import { updatePetSchema } from '@repo/data-utils/zod-schema/pets'
import { applicationStatusEnum } from '@repo/data-utils/zod-schema/applications'
import {
  contributionStatusEnum,
  createContributionSchema,
} from '@repo/data-utils/zod-schema/sponsorships'
import type { AppEnv, PetRow } from '../env'
import { requireRole, requireSession } from '../middleware/auth'
import { zJson, zQuery } from '../middleware/validate'
import { groupPhotoKeys, toPublicPet } from '../lib/to-public-pet'
import { pickSafe } from '../logger/logger'

async function composePets(rows: PetRow[], assetBase: string) {
  if (rows.length === 0) return []
  const images = await getImagesByPetIds(rows.map((r) => r.id))
  const byPet = groupPhotoKeys(images)
  return rows.map((row) => toPublicPet(row, byPet.get(row.id) ?? [], assetBase))
}


const beforeQuery = z.object({
  createdBefore: z.coerce.number().optional(),
})

const submittedBeforeQuery = z.object({
  submittedBefore: z.coerce.number().optional(),
})

export const adminRouter = new Hono<AppEnv>()
  .use('*', requireSession, requireRole('admin'))
  // ---- Shelters ----------------------------------------------------------
  .get(
    '/shelters',
    zQuery(z.object({ status: shelterStatusEnum })),
    async (c) => {
      const { status } = c.req.valid('query')
      const items = await getSheltersByStatus(status)
      return c.json({ items })
    },
  )
  .patch(
    '/shelters/:shelterId',
    zJson(updateShelterSchema),
    async (c) => {
      const id = c.req.param('shelterId')
      const row = await getShelter(id)
      if (!row) return c.json({ error: 'not_found' }, 404)
      await updateShelter(id, c.req.valid('json'))
      c.var.logger.info('shelter.updated', {
        ...pickSafe(c.var.user),
        shelterId: id,
      })
      return c.json({ ok: true })
    },
  )
  .post(
    '/shelters/:shelterId/status',
    zJson(
      z.object({
        status: z.enum(['active', 'suspended']),
        reason: z.string().optional(),
        notify: z.boolean().optional(),
      }),
    ),
    async (c) => {
      const id = c.req.param('shelterId')
      const { status } = c.req.valid('json')

      const row = await getShelter(id)
      if (!row) return c.json({ error: 'not_found' }, 404)

      const audit = (to: string) =>
        c.var.logger.info('shelter.status_changed', {
          ...pickSafe(c.var.user),
          shelterId: id,
          from: row.status,
          to,
        })

      if (status === 'suspended') {
        await setShelterStatus(id, 'suspended')
        audit('suspended')
        return c.json({ ok: true })
      }

      // status === 'active'
      if (row.status === 'pending') {
        const result = await approveShelter(id)
        if (!result.ok) {
          const code = result.reason === 'not_found' ? 404 : 409
          return c.json({ error: result.reason }, code)
        }
        audit('active')
        return c.json({ ok: true })
      }

      if (row.status === 'suspended') {
        await setShelterStatus(id, 'active')
        audit('active')
        return c.json({ ok: true })
      }

      // already active — nothing to transition
      return c.json({ error: 'no_op' }, 409)
    },
  )

  // ---- Pets (any shelter) ------------------------------------------------
  .get(
    '/shelters/:shelterId/pets',
    zQuery(beforeQuery),
    async (c) => {
      const { createdBefore } = c.req.valid('query')
      const rows = await getPetsByShelter(
        c.req.param('shelterId'),
        createdBefore,
      )
      const nextCursor =
        rows.length === 25 ? rows[rows.length - 1]!.createdAt.getTime() : null
      const items = await composePets(rows, c.env.PUBLIC_ASSET_BASE_URL)
      return c.json({ items, nextCursor })
    },
  )
  .patch('/pets/:id', zJson(updatePetSchema), async (c) => {
    const petId = c.req.param('id')
    await updatePet(petId, c.req.valid('json'))
    c.var.logger.info('pet.updated', { ...pickSafe(c.var.user), petId })
    return c.json({ ok: true })
  })
  .delete('/pets/:id', async (c) => {
    const petId = c.req.param('id')
    await deletePet(petId)
    c.var.logger.info('pet.deleted', { ...pickSafe(c.var.user), petId })
    return c.json({ ok: true })
  })

  // ---- Applications (any shelter) ----------------------------------------
  .get(
    '/shelters/:shelterId/applications',
    zQuery(submittedBeforeQuery),
    async (c) => {
      const { submittedBefore } = c.req.valid('query')
      const items = await getApplicationsByShelter(
        c.req.param('shelterId'),
        submittedBefore,
      )
      const nextCursor =
        items.length === 25
          ? items[items.length - 1]!.submittedAt.getTime()
          : null
      return c.json({ items, nextCursor })
    },
  )
  .patch(
    '/applications/:id/status',
    zJson(z.object({ status: applicationStatusEnum })),
    async (c) => {
      const applicationId = c.req.param('id')
      const { status } = c.req.valid('json')
      await updateApplicationStatus(applicationId, status)
      c.var.logger.info('application.status_changed', {
        ...pickSafe(c.var.user),
        applicationId,
        status,
      })
      return c.json({ ok: true })
    },
  )

  // ---- Sponsorship contributions -----------------------------------------
  .post('/sponsorships/contributions', zJson(createContributionSchema), async (c) => {
    const id = await recordContribution(c.req.valid('json'))
    c.var.logger.info('contribution.recorded', {
      ...pickSafe(c.var.user),
      contributionId: id,
    })
    return c.json({ id })
  })
  .patch(
    '/sponsorships/contributions/:contributionId/status',
    zJson(z.object({ status: contributionStatusEnum })),
    async (c) => {
      const contributionId = c.req.param('contributionId')
      const { status } = c.req.valid('json')
      await updateContributionStatus(contributionId, status)
      c.var.logger.info('contribution.status_changed', {
        ...pickSafe(c.var.user),
        contributionId,
        status,
      })
      return c.json({ ok: true })
    },
  )
