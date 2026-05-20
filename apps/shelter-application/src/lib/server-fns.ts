import {
  adoptionStatusEnum,
  ageEnum,
  genderEnum,
  petStatusEnum,
  petTypeEnum,
  sizeEnum,
} from '@repo/domain'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { api } from './api.server'

const newPetInput = z.object({
  name: z.string().min(1),
  type: petTypeEnum,
  breed: z.string().min(1),
  age: ageEnum,
  ageLabel: z.string().min(1),
  gender: genderEnum,
  size: sizeEnum,
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().optional(),
  }),
  photos: z.array(z.string()),
  description: z.string().min(1),
  outOfTown: z.boolean(),
  transportAvailable: z.boolean(),
  shelterId: z.string().min(1),
  status: petStatusEnum,
})

export const createPetFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => newPetInput.parse(d))
  .handler(async ({ data }) => api.createPet(data))

export const listApplicationsFn = createServerFn({ method: 'GET' }).handler(
  async () => api.listAdoptionApplications(),
)

const idInput = z.object({ id: z.string().min(1) })
export const getApplicationFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => idInput.parse(d))
  .handler(async ({ data }) => api.getAdoptionApplication(data))

const updateStatusInput = z.object({
  id: z.string().min(1),
  status: adoptionStatusEnum,
  notes: z.string().optional(),
  notify: z.boolean().optional(),
  actor: z.string().optional(),
})
export const updateApplicationStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => updateStatusInput.parse(d))
  .handler(async ({ data }) => api.updateAdoptionApplicationStatus(data))

const createApplicationInput = z.object({
  applicantName: z.string().min(1),
  applicantEmail: z.string().email(),
  petName: z.string().min(1),
  petBreed: z.string().optional(),
  petId: z.string().optional(),
  notes: z.string().optional(),
  actor: z.string().optional(),
})
export const createApplicationFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => createApplicationInput.parse(d))
  .handler(async ({ data }) => api.createAdoptionApplication(data))
