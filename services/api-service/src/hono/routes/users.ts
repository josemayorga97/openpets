import { Hono } from 'hono'
import {
  getUserProfile,
  upsertUserProfile,
} from '@repo/data-utils/queries/users'
import { upsertUserProfileSchema } from '@repo/data-utils/zod-schema/users'
import type { AppEnv } from '../env'
import { requireSession } from '../middleware/auth'
import { zJson } from '../middleware/validate'

// Platform-admin role management lives at /api/auth/admin/* (Better Auth
// admin plugin). This router only handles the user's own profile.
const profileBody = upsertUserProfileSchema.omit({ userId: true })

export const usersRouter = new Hono<AppEnv>()
  .get('/me/profile', requireSession, async (c) => {
    const row = await getUserProfile(c.var.user!.id)
    if (!row) return c.json({ error: 'not_found' }, 404)
    return c.json(row)
  })
  .put('/me/profile', requireSession, zJson(profileBody), async (c) => {
    await upsertUserProfile({ ...c.req.valid('json'), userId: c.var.user!.id })
    return c.json({ ok: true })
  })
