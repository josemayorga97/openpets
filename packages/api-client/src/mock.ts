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
import {
  adminPets,
  adoptionApplications,
  breedsByType,
  categories,
  dashboardMetrics,
  pets,
  populationByRegion,
  searchPets,
  shelters,
  successStories,
} from '@repo/mock-data'
import type { ApiClient } from './types'

const wait = () => new Promise<void>((r) => setTimeout(r, 150))

export class MockClient implements ApiClient {
  private shelterStore: Shelter[] = shelters.map((s) => ({ ...s }))
  private petStore: Pet[] = [...adminPets]
  private applicationStore: AdoptionApplication[] = adoptionApplications.map(
    (a) => ({ ...a, timeline: [...a.timeline] }),
  )

  async listFeaturedPets({ limit }: { limit: number }): Promise<Pet[]> {
    await wait()
    return pets.slice(0, limit)
  }
  async searchPets(filters: SearchFilters): Promise<SearchResult> {
    await wait()
    return searchPets(filters)
  }
  async getPet({ id }: { id: string }): Promise<Pet | null> {
    await wait()
    return pets.find((p) => p.id === id) ?? null
  }
  async listCategories(): Promise<Category[]> {
    await wait()
    return categories
  }
  async listSuccessStories({ limit }: { limit: number }): Promise<SuccessStory[]> {
    await wait()
    return successStories.slice(0, limit)
  }
  async listBreeds({ type }: { type: PetType }): Promise<string[]> {
    await wait()
    return breedsByType[type]
  }

  async listShelters(args?: { status?: ShelterStatus }): Promise<Shelter[]> {
    await wait()
    if (!args?.status) return this.shelterStore
    return this.shelterStore.filter((s) => s.status === args.status)
  }
  async getShelter({ id }: { id: string }): Promise<Shelter | null> {
    await wait()
    return this.shelterStore.find((s) => s.id === id) ?? null
  }
  async updateShelterStatus({
    id,
    status,
  }: {
    id: string
    status: ShelterStatus
    reason?: string
    notify?: boolean
  }): Promise<Shelter> {
    await wait()
    const idx = this.shelterStore.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error(`Shelter not found: ${id}`)
    const next = { ...this.shelterStore[idx], status }
    this.shelterStore[idx] = next
    return next
  }

  async listAdminPets(args?: { status?: PetStatus }): Promise<Pet[]> {
    await wait()
    if (!args?.status) return this.petStore
    return this.petStore.filter((p) => p.status === args.status)
  }
  async createPet(
    input: Omit<Pet, 'id' | 'createdAt'> & { id?: string; createdAt?: string },
  ): Promise<Pet> {
    await wait()
    const id =
      input.id ??
      `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random()
        .toString(36)
        .slice(2, 7)}`
    const pet: Pet = {
      ...input,
      id,
      createdAt: input.createdAt ?? new Date().toISOString().slice(0, 10),
    }
    this.petStore = [pet, ...this.petStore]
    return pet
  }
  async getDashboardMetrics(): Promise<{
    metrics: DashboardMetrics
    populationByRegion: RegionPopulation[]
  }> {
    await wait()
    return { metrics: dashboardMetrics, populationByRegion }
  }

  async listAdoptionApplications(args?: {
    status?: AdoptionStatus
  }): Promise<AdoptionApplication[]> {
    await wait()
    const list = [...this.applicationStore].sort((a, b) =>
      a.submittedAt < b.submittedAt ? 1 : -1,
    )
    if (!args?.status) return list
    return list.filter((a) => a.status === args.status)
  }
  async getAdoptionApplication({
    id,
  }: {
    id: string
  }): Promise<AdoptionApplication | null> {
    await wait()
    return this.applicationStore.find((a) => a.id === id) ?? null
  }
  async updateAdoptionApplicationStatus({
    id,
    status,
    notes,
    notify,
    actor,
  }: {
    id: string
    status: AdoptionStatus
    notes?: string
    notify?: boolean
    actor?: string
  }): Promise<AdoptionApplication> {
    await wait()
    const idx = this.applicationStore.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error(`Application not found: ${id}`)
    const prev = this.applicationStore[idx]
    const entry = {
      id: `t-${id}-${Date.now()}`,
      at: new Date().toISOString(),
      actor: actor ?? 'System Admin',
      title: `Status changed to ${statusLabel(status)}`,
      detail: notes && notes.trim() ? notes.trim() : undefined,
    }
    const next: AdoptionApplication = {
      ...prev,
      status,
      notes: notes ?? prev.notes,
      notify: notify ?? prev.notify,
      timeline: [entry, ...prev.timeline],
    }
    this.applicationStore[idx] = next
    return next
  }
  async createAdoptionApplication(input: {
    applicantName: string
    applicantEmail: string
    petName: string
    petBreed?: string
    petId?: string
    notes?: string
    actor?: string
  }): Promise<AdoptionApplication> {
    await wait()
    const id = `app-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    const app: AdoptionApplication = {
      id,
      applicantName: input.applicantName,
      applicantEmail: input.applicantEmail,
      petName: input.petName,
      petBreed: input.petBreed,
      petId: input.petId,
      submittedAt: now,
      status: 'review',
      notes: input.notes ?? '',
      notify: true,
      timeline: [
        {
          id: `t-${id}-create`,
          at: now,
          actor: input.actor ?? 'Shelter Staff',
          title: 'Application created manually',
          detail: input.notes?.trim() || undefined,
        },
      ],
    }
    this.applicationStore = [app, ...this.applicationStore]
    return app
  }
}

function statusLabel(s: AdoptionStatus): string {
  switch (s) {
    case 'pending':
      return 'Pending'
    case 'review':
      return 'Pending Review'
    case 'approved':
      return 'Approved'
    case 'more_info':
      return 'More Info Requested'
    case 'declined':
      return 'Declined'
    case 'completed':
      return 'Completed'
  }
}
