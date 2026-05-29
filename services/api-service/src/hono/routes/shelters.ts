import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import {
  createShelter,
  getShelter,
  updateShelter,
} from '@repo/data-utils/queries/shelters'
import {
  createShelterSchema,
  updateShelterSchema,
} from '@repo/data-utils/zod-schema/shelters'
import type { AppEnv } from '../env'
import {
  requireRole,
  requireSession,
  requireShelterOwner,
} from '../middleware/auth'
import { zJson } from '../middleware/validate'

// applicantUserId comes from the session, never the client.
const createBody = createShelterSchema.omit({
  id: true,
  applicantUserId: true,
  status: true,
})

export const sheltersRouter = new Hono<AppEnv>()
  .post('/', requireSession, zJson(createBody), async (c) => {
    const id = nanoid(12)
    await createShelter({
      ...c.req.valid('json'),
      id,
      status: 'pending',
      applicantUserId: c.var.user?.id,
    })
    return c.json({ id, status: 'pending' as const })
  })
  .get('/:shelterId', async (c) => {
    const row = await getShelter(c.req.param('shelterId'))
    if (!row) return c.json({ error: 'not_found' }, 404)
    return c.json(row)
  })
  .patch(
    '/:shelterId',
    requireSession,
    requireRole('shelter'),
    requireShelterOwner,
    zJson(updateShelterSchema),
    async (c) => {
      await updateShelter(c.var.shelter!.id, c.req.valid('json'))
      return c.json({ ok: true })
    },
  )
