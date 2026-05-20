import type {
  AdoptionApplication,
  AdoptionStatus,
  Category,
  DashboardMetrics,
  Pet,
  PetType,
  RegionPopulation,
  SearchFilters,
  SearchResult,
  Shelter,
  ShelterStatus,
  SuccessStory,
} from '@repo/domain'

export interface ApiClient {
  listFeaturedPets(args: { limit: number }): Promise<Pet[]>
  searchPets(filters: SearchFilters): Promise<SearchResult>
  getPet(args: { id: string }): Promise<Pet | null>
  listCategories(): Promise<Category[]>
  listSuccessStories(args: { limit: number }): Promise<SuccessStory[]>
  listBreeds(args: { type: PetType }): Promise<string[]>

  listShelters(args?: { status?: ShelterStatus }): Promise<Shelter[]>
  getShelter(args: { id: string }): Promise<Shelter | null>
  updateShelterStatus(args: {
    id: string
    status: ShelterStatus
    reason?: string
    notify?: boolean
  }): Promise<Shelter>

  listAdminPets(args?: { status?: 'available' | 'medical' | 'adopted' }): Promise<Pet[]>
  createPet(input: Omit<Pet, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<Pet>
  getDashboardMetrics(): Promise<{
    metrics: DashboardMetrics
    populationByRegion: RegionPopulation[]
  }>

  listAdoptionApplications(args?: {
    status?: AdoptionStatus
  }): Promise<AdoptionApplication[]>
  getAdoptionApplication(args: {
    id: string
  }): Promise<AdoptionApplication | null>
  updateAdoptionApplicationStatus(args: {
    id: string
    status: AdoptionStatus
    notes?: string
    notify?: boolean
    actor?: string
  }): Promise<AdoptionApplication>
  createAdoptionApplication(input: {
    applicantName: string
    applicantEmail: string
    petName: string
    petBreed?: string
    petId?: string
    notes?: string
    actor?: string
  }): Promise<AdoptionApplication>
}
