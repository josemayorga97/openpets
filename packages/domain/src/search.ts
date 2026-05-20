import { z } from 'zod'
import { ageEnum, petSchema, petTypeEnum, sizeEnum } from './pet'

export const sortEnum = z.enum(['nearest', 'newest', 'oldest'])
export type SortKey = z.infer<typeof sortEnum>

export const searchFiltersSchema = z.object({
  petType: petTypeEnum.optional(),
  distance: z.number().optional(),
  location: z.string().optional(),
  breeds: z.array(z.string()).optional(),
  ages: z.array(ageEnum).optional(),
  sizes: z.array(sizeEnum).optional(),
  includeOutOfTown: z.boolean().optional(),
  sort: sortEnum.optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(60).optional(),
})
export type SearchFilters = z.infer<typeof searchFiltersSchema>

export const searchResultSchema = z.object({
  results: z.array(petSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type SearchResult = z.infer<typeof searchResultSchema>
