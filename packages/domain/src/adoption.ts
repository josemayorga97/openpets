import { z } from 'zod'

export const adoptionStatusEnum = z.enum([
  'pending',
  'review',
  'approved',
  'more_info',
  'declined',
  'completed',
])
export type AdoptionStatus = z.infer<typeof adoptionStatusEnum>

export const adoptionTimelineEntrySchema = z.object({
  id: z.string(),
  at: z.string(),
  actor: z.string(),
  title: z.string(),
  detail: z.string().optional(),
})
export type AdoptionTimelineEntry = z.infer<typeof adoptionTimelineEntrySchema>

export const adoptionApplicationSchema = z.object({
  id: z.string(),
  applicantName: z.string(),
  applicantEmail: z.string(),
  petId: z.string().optional(),
  petName: z.string(),
  petBreed: z.string().optional(),
  submittedAt: z.string(),
  status: adoptionStatusEnum,
  notes: z.string().default(''),
  notify: z.boolean().default(true),
  timeline: z.array(adoptionTimelineEntrySchema).default([]),
})
export type AdoptionApplication = z.infer<typeof adoptionApplicationSchema>
