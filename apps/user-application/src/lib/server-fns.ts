import { searchPetsSchema } from '@repo/data-utils/zod-schema/pets'
import { createServerFn } from '@tanstack/react-start'
import { makeApi } from './api.server'

// Static browse categories for the home page. Built client-side from the
// species the catalog supports rather than a (now-removed) backend route.
const CATEGORIES = [
  { id: 'dog', label: 'Dogs', icon: 'PawPrint' },
  { id: 'cat', label: 'Cats', icon: 'Cat' },
  { id: 'rabbit', label: 'Rabbits', icon: 'Rabbit' },
  { id: 'other', label: 'Other', icon: 'PawPrint' },
]

export const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const client = makeApi()
  const res = await client.pets.featured.$get()
  if (!res.ok) throw new Error(`API ${res.status}`)
  const { items } = await res.json()
  return { featured: items, categories: CATEGORIES }
})

export const searchPetsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => searchPetsSchema.parse(d))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.pets.search.$get({
      query: {
        ...(data.species ? { species: data.species } : {}),
        ...(data.breeds ? { breeds: data.breeds } : {}),
        ...(data.ages ? { ages: data.ages } : {}),
        ...(data.sizes ? { sizes: data.sizes } : {}),
        ...(data.sort ? { sort: data.sort } : {}),
        ...(data.page != null ? { page: data.page } : {}),
        ...(data.pageSize != null ? { pageSize: data.pageSize } : {}),
      },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })

export const fetchPet = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => ({ id: String((d as { id: string }).id) }))
  .handler(async ({ data }) => {
    const client = makeApi()
    const res = await client.pets[':id'].$get({ param: { id: data.id } })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.json()
  })
