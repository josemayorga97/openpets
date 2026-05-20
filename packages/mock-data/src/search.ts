import type { Pet, SearchFilters, SearchResult } from '@repo/domain'
import { pets } from './pets'

export function searchPets(filters: SearchFilters): SearchResult {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 12
  const sort = filters.sort ?? 'nearest'

  let results: Pet[] = pets.slice()

  if (filters.petType) {
    results = results.filter((p) => p.type === filters.petType)
  }
  if (filters.breeds && filters.breeds.length > 0) {
    const set = new Set(filters.breeds)
    results = results.filter((p) =>
      Array.from(set).some((b) => p.breed.includes(b)),
    )
  }
  if (filters.ages && filters.ages.length > 0) {
    const set = new Set(filters.ages)
    results = results.filter((p) => set.has(p.age))
  }
  if (filters.sizes && filters.sizes.length > 0) {
    const set = new Set(filters.sizes)
    results = results.filter((p) => set.has(p.size))
  }
  if (filters.distance) {
    results = results.filter(
      (p) => (p.location.distanceMiles ?? Number.POSITIVE_INFINITY) <= filters.distance!,
    )
  }
  if (filters.includeOutOfTown === false) {
    results = results.filter((p) => !p.outOfTown)
  }

  results.sort((a, b) => {
    if (sort === 'nearest') {
      return (
        (a.location.distanceMiles ?? Number.POSITIVE_INFINITY) -
        (b.location.distanceMiles ?? Number.POSITIVE_INFINITY)
      )
    }
    if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
    return a.createdAt.localeCompare(b.createdAt)
  })

  const total = results.length
  const start = (page - 1) * pageSize
  const paged = results.slice(start, start + pageSize)

  return { results: paged, total, page, pageSize }
}
