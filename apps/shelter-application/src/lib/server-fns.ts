import { createPetSchema } from '@repo/data-utils/zod-schema/pets'
import { applicationStatusEnum } from '@repo/data-utils/zod-schema/applications'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { makeApi } from './api.server'

// shelterId is implied by the session server-side, so the form never sends it.
const newPetInput = createPetSchema.omit({ shelterId: true })

export const createPetFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => newPetInput.parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.me.pets.$post({ json: data })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })

export const listMyPetsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const client = makeApi()
  const res = await client.me.pets.$get({ query: {} })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const { items } = await res.json()
  return items
})

export const listApplicationsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const client = makeApi()
    const res = await client.me.applications.$get({ query: {} })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const { items } = await res.json()
    return items
  },
)

const idInput = z.object({ id: z.string().min(1) })
export const getApplicationFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => idInput.parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.me.applications[':id'].$get({
      param: { id: data.id },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })

const updateStatusInput = z.object({
  id: z.string().min(1),
  status: applicationStatusEnum,
})
export const updateApplicationStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => updateStatusInput.parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.me.applications[':id'].status.$patch({
      param: { id: data.id },
      json: { status: data.status },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })
