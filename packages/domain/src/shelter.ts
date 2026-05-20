import { z } from 'zod'

export const shelterStatusEnum = z.enum(['active', 'pending', 'suspended'])
export type ShelterStatus = z.infer<typeof shelterStatusEnum>

export const shelterSchema = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string(),
  contact: z.string(),
  status: shelterStatusEnum,
  pets: z.number(),
  lastActivity: z.string(),
  location: z.string(),
  appliedAt: z.string(),
})
export type Shelter = z.infer<typeof shelterSchema>

export const dashboardMetricsSchema = z.object({
  totalPets: z.number(),
  totalPetsTrend: z.number(),
  pendingApprovals: z.number(),
  activeShelters: z.number(),
  regions: z.number(),
  adoptionRate: z.number(),
  adoptionRateTrend: z.number(),
})
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>

export const regionPopulationSchema = z.object({
  label: z.string(),
  value: z.number(),
  percent: z.number(),
})
export type RegionPopulation = z.infer<typeof regionPopulationSchema>
