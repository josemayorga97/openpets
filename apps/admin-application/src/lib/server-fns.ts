import { shelterStatusEnum } from '@repo/domain'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { api } from './api.server'

export const fetchDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  const [{ metrics, populationByRegion }, pendingShelters] = await Promise.all([
    api.getDashboardMetrics(),
    api.listShelters({ status: 'pending' }),
  ])
  return { metrics, populationByRegion, pendingShelters: pendingShelters.slice(0, 3) }
})

export const fetchShelters = createServerFn({ method: 'GET' }).handler(async () => {
  return api.listShelters()
})

export const fetchShelter = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => api.getShelter({ id: data.id }))

export const updateShelterStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string(),
        status: shelterStatusEnum,
        reason: z.string().optional(),
        notify: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => api.updateShelterStatus(data))

export const fetchAdminPets = createServerFn({ method: 'GET' }).handler(async () => {
  return api.listAdminPets()
})
