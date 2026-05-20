import { searchFiltersSchema } from '@repo/domain'
import type { PetType } from '@repo/domain'
import { createServerFn } from '@tanstack/react-start'
import { api } from './api.server'

export const fetchHomeData = createServerFn({ method: 'GET' }).handler(async () => {
  const [featured, categories, stories] = await Promise.all([
    api.listFeaturedPets({ limit: 4 }),
    api.listCategories(),
    api.listSuccessStories({ limit: 1 }),
  ])
  return { featured, categories, stories }
})

export const searchPetsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => searchFiltersSchema.parse(d))
  .handler(async ({ data }) => api.searchPets(data))

export const fetchPet = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => ({ id: String((d as { id: string }).id) }))
  .handler(async ({ data }) => api.getPet({ id: data.id }))

export const fetchBreeds = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => ({ type: (d as { type: PetType }).type }))
  .handler(async ({ data }) => api.listBreeds({ type: data.type }))
