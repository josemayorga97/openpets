import { getShelter } from '@repo/data-utils/queries/shelters'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { pickSafe } from '../../../logger/logger'

export const requireShelterOwner = createMiddleware<AppEnv>(async (c, next) => {
  const logger = c.var.logger
  const shelterId = c.req.param('shelterId')

  const base = {
    event: 'authz.shelter_owner_check',
    shelterId,
    ...pickSafe(c.var.user),
  }

  if (!shelterId) {
    logger.warn('authz.shelter_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'missing_param',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const userId = c.var.user?.id
  if (!userId) {
    logger.warn('authz.shelter_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'no_user',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const row = await getShelter(shelterId)
  if (!row) {
    logger.warn('authz.shelter_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_found',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  if (row.applicantUserId !== userId) {
    logger.warn('authz.shelter_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_owner',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  c.set('shelter', { id: row.id, status: row.status })
  logger.info('authz.shelter_owner_check', { ...base, outcome: 'granted' })
  await next()
})
