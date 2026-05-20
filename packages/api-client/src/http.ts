import type {
  AdoptionApplication,
  AdoptionStatus,
  Category,
  DashboardMetrics,
  Pet,
  PetStatus,
  PetType,
  RegionPopulation,
  SearchFilters,
  SearchResult,
  Shelter,
  ShelterStatus,
  SuccessStory,
} from '@repo/domain'
import type { ApiClient } from './types'

export interface HttpClientOpts {
  baseUrl: string
  fetch?: typeof fetch
}

export class HttpClient implements ApiClient {
  private baseUrl: string
  private fetchImpl: typeof fetch
  constructor(opts: HttpClientOpts) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '')
    this.fetchImpl = opts.fetch ?? fetch
  }
  private async json<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, init)
    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
    return res.json() as Promise<T>
  }
  listFeaturedPets({ limit }: { limit: number }): Promise<Pet[]> {
    return this.json(`/pets/featured?limit=${limit}`)
  }
  searchPets(filters: SearchFilters): Promise<SearchResult> {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(filters)) {
      if (v == null) continue
      qs.set(k, Array.isArray(v) ? v.join(',') : String(v))
    }
    return this.json(`/pets/search?${qs.toString()}`)
  }
  getPet({ id }: { id: string }): Promise<Pet | null> {
    return this.json(`/pets/${encodeURIComponent(id)}`)
  }
  listCategories(): Promise<Category[]> {
    return this.json('/categories')
  }
  listSuccessStories({ limit }: { limit: number }): Promise<SuccessStory[]> {
    return this.json(`/success-stories?limit=${limit}`)
  }
  listBreeds({ type }: { type: PetType }): Promise<string[]> {
    return this.json(`/breeds?type=${type}`)
  }

  listShelters(args?: { status?: ShelterStatus }): Promise<Shelter[]> {
    const qs = args?.status ? `?status=${args.status}` : ''
    return this.json(`/shelters${qs}`)
  }
  getShelter({ id }: { id: string }): Promise<Shelter | null> {
    return this.json(`/shelters/${encodeURIComponent(id)}`)
  }
  updateShelterStatus(args: {
    id: string
    status: ShelterStatus
    reason?: string
    notify?: boolean
  }): Promise<Shelter> {
    return this.json(`/shelters/${encodeURIComponent(args.id)}/status`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        status: args.status,
        reason: args.reason,
        notify: args.notify,
      }),
    })
  }

  listAdminPets(args?: { status?: PetStatus }): Promise<Pet[]> {
    const qs = args?.status ? `?status=${args.status}` : ''
    return this.json(`/admin/pets${qs}`)
  }
  createPet(
    input: Omit<Pet, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ): Promise<Pet> {
    return this.json(`/admin/pets`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
  }
  getDashboardMetrics(): Promise<{
    metrics: DashboardMetrics
    populationByRegion: RegionPopulation[]
  }> {
    return this.json('/admin/dashboard')
  }

  listAdoptionApplications(args?: {
    status?: AdoptionStatus
  }): Promise<AdoptionApplication[]> {
    const qs = args?.status ? `?status=${args.status}` : ''
    return this.json(`/adoption-applications${qs}`)
  }
  getAdoptionApplication({
    id,
  }: {
    id: string
  }): Promise<AdoptionApplication | null> {
    return this.json(`/adoption-applications/${encodeURIComponent(id)}`)
  }
  updateAdoptionApplicationStatus(args: {
    id: string
    status: AdoptionStatus
    notes?: string
    notify?: boolean
    actor?: string
  }): Promise<AdoptionApplication> {
    return this.json(
      `/adoption-applications/${encodeURIComponent(args.id)}/status`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(args),
      },
    )
  }
  createAdoptionApplication(input: {
    applicantName: string
    applicantEmail: string
    petName: string
    petBreed?: string
    petId?: string
    notes?: string
    actor?: string
  }): Promise<AdoptionApplication> {
    return this.json(`/adoption-applications`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
  }
}
