import { Hono } from 'hono'
import { z } from 'zod'
import {
  createSponsorship,
  getContributionsBySponsor,
  getContributionsBySponsorship,
  getSponsorship,
  getSponsorshipsByPet,
  getSponsorshipsBySponsor,
  updateSponsorshipStatus,
} from '@repo/data-utils/queries/sponsorships'
import {
  createSponsorshipSchema,
  sponsorshipStatusEnum,
} from '@repo/data-utils/zod-schema/sponsorships'
import type { AppEnv } from '../env'
import { requireSession } from '../middleware/auth'
import { zJson, zQuery } from '../middleware/validate'

const createSponsorshipBody = createSponsorshipSchema.omit({ sponsorId: true })

export const sponsorshipsRouter = new Hono<AppEnv>()
  .post('/', requireSession, zJson(createSponsorshipBody), async (c) => {
    const id = await createSponsorship({
      ...c.req.valid('json'),
      sponsorId: c.var.user!.id,
    })
    return c.json({ id })
  })
  .get('/by-sponsor/me', requireSession, async (c) => {
    const items = await getSponsorshipsBySponsor(c.var.user!.id)
    return c.json({ items })
  })
  .get('/by-pet/:petId', async (c) => {
    const items = await getSponsorshipsByPet(c.req.param('petId'))
    return c.json({ items })
  })
  .get(
    '/contributions/by-sponsor/me',
    requireSession,
    zQuery(z.object({ occurredBefore: z.coerce.number().optional() })),
    async (c) => {
      const { occurredBefore } = c.req.valid('query')
      const items = await getContributionsBySponsor(
        c.var.user!.id,
        occurredBefore,
      )
      const nextCursor =
        items.length === 25
          ? items[items.length - 1]!.occurredAt.getTime()
          : null
      return c.json({ items, nextCursor })
    },
  )
  .get('/:id', requireSession, async (c) => {
    const row = await getSponsorship(c.req.param('id'))
    if (!row) return c.json({ error: 'not_found' }, 404)
    if (row.sponsorId !== c.var.user!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    return c.json(row)
  })
  .patch(
    '/:id/status',
    requireSession,
    zJson(z.object({ status: sponsorshipStatusEnum })),
    async (c) => {
      const id = c.req.param('id')
      const row = await getSponsorship(id)
      if (!row) return c.json({ error: 'not_found' }, 404)
      if (row.sponsorId !== c.var.user!.id) {
        return c.json({ error: 'forbidden' }, 403)
      }
      await updateSponsorshipStatus(id, c.req.valid('json').status)
      return c.json({ ok: true })
    },
  )
  .get('/:sponsorshipId/contributions', requireSession, async (c) => {
    const sponsorshipId = c.req.param('sponsorshipId')
    const row = await getSponsorship(sponsorshipId)
    if (!row) return c.json({ error: 'not_found' }, 404)
    if (row.sponsorId !== c.var.user!.id) {
      return c.json({ error: 'forbidden' }, 403)
    }
    const items = await getContributionsBySponsorship(sponsorshipId)
    return c.json({ items })
  })
