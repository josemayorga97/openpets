import { getPet } from '@repo/data-utils/queries/pets'
import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../../../env'
import { pickSafe } from '../../../logger/logger'

export const requirePetOwner = createMiddleware<AppEnv>(async (c, next) => {
  const logger = c.var.logger
  const petId = c.req.param('id')

  const base = {
    event: 'authz.pet_owner_check',
    petId,
    ...pickSafe(c.var.user),
  }

  if (!petId) {
    logger.warn('authz.pet_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'missing_param',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const shelter = c.var.shelter
  if (!shelter) {
    logger.warn('authz.pet_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'no_shelter_context',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  const row = await getPet(petId)
  if (!row) {
    logger.warn('authz.pet_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_found',
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  if (row.shelterId !== shelter.id) {
    logger.warn('authz.pet_owner_check', {
      ...base,
      outcome: 'denied',
      reason: 'not_owner',
      shelterId: shelter.id,
    })
    return c.json({ error: 'forbidden' }, 403)
  }

  c.set('pet', row)
  logger.info('authz.pet_owner_check', { ...base, outcome: 'granted' })
  await next()
})
