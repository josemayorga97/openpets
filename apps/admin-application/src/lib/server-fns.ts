import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { makeApi } from './api.server'

// The backend has no "all shelters" route — list each status and merge.
const SHELTER_STATUSES = ['active', 'pending', 'suspended'] as const

export const fetchShelters = createServerFn({ method: 'GET' }).handler(async () => {
  const client = makeApi()
  const responses = await Promise.all(
    SHELTER_STATUSES.map((status) =>
      client.admin.shelters.$get({ query: { status } }),
    ),
  )
  const lists = await Promise.all(
    responses.map(async (res) => {
      if (!res.ok) throw new Error(`API ${res.status}`)
      const { items } = await res.json()
      return items
    }),
  )
  return lists.flat()
})

export const fetchShelter = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.shelters[':shelterId'].$get({
      param: { shelterId: data.id },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })

export const updateShelterStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string(),
        // Backend only accepts active|suspended via this route.
        status: z.enum(['active', 'suspended']),
        reason: z.string().optional(),
        notify: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.admin.shelters[':shelterId'].status.$post({
      param: { shelterId: data.id },
      json: { status: data.status, reason: data.reason, notify: data.notify },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })

export const fetchAdminPets = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => z.object({ shelterId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.admin.shelters[':shelterId'].pets.$get({
      param: { shelterId: data.shelterId },
      query: {},
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const { items } = await res.json()
    return items
  })

export const fetchDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  const client = makeApi()
  const responses = await Promise.all(
    SHELTER_STATUSES.map((status) =>
      client.admin.shelters.$get({ query: { status } }),
    ),
  )
  const [active, pending, suspended] = await Promise.all(
    responses.map(async (res) => {
      if (!res.ok) throw new Error(`API ${res.status}`)
      const { items } = await res.json()
      return items
    }),
  )
  return {
    counts: {
      total: active.length + pending.length + suspended.length,
      active: active.length,
      pending: pending.length,
      suspended: suspended.length,
    },
    pendingShelters: pending.slice(0, 3),
  }
})
