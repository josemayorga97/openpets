import type { DashboardMetrics, RegionPopulation } from '@repo/domain'

export const dashboardMetrics: DashboardMetrics = {
  totalPets: 12480,
  totalPetsTrend: 8.2,
  pendingApprovals: 24,
  activeShelters: 342,
  regions: 12,
  adoptionRate: 68,
  adoptionRateTrend: 2.1,
}

export const populationByRegion: RegionPopulation[] = [
  { label: 'North', value: 450, percent: 45 },
  { label: 'West', value: 850, percent: 85 },
  { label: 'East', value: 600, percent: 60 },
  { label: 'South', value: 300, percent: 30 },
]
