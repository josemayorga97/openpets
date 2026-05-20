import { z } from 'zod'

export const petTypeEnum = z.enum(['dog', 'cat', 'other'])
export type PetType = z.infer<typeof petTypeEnum>

export const ageEnum = z.enum(['puppy', 'young', 'adult', 'senior'])
export type AgeBucket = z.infer<typeof ageEnum>

export const sizeEnum = z.enum(['small', 'medium', 'large', 'xlarge'])
export type Size = z.infer<typeof sizeEnum>

export const genderEnum = z.enum(['male', 'female'])
export type Gender = z.infer<typeof genderEnum>

export const petStatusEnum = z.enum(['available', 'medical', 'adopted'])
export type PetStatus = z.infer<typeof petStatusEnum>

export const locationSchema = z.object({
  city: z.string(),
  state: z.string(),
  zip: z.string().optional(),
  distanceMiles: z.number().optional(),
})
export type PetLocation = z.infer<typeof locationSchema>

export const petSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: petTypeEnum,
  breed: z.string(),
  age: ageEnum,
  ageLabel: z.string(),
  gender: genderEnum,
  size: sizeEnum,
  location: locationSchema,
  photos: z.array(z.string()),
  description: z.string(),
  outOfTown: z.boolean(),
  transportAvailable: z.boolean(),
  shelterId: z.string(),
  status: petStatusEnum.default('available'),
  createdAt: z.string(),
})
export type Pet = z.infer<typeof petSchema>

export const categorySchema = z.object({
  id: petTypeEnum,
  label: z.string(),
  icon: z.string(),
})
export type Category = z.infer<typeof categorySchema>

export const successStorySchema = z.object({
  id: z.string(),
  quote: z.string(),
  body: z.string(),
  adopterNames: z.string(),
  adopterInitials: z.string(),
  petName: z.string(),
  year: z.number(),
  photo: z.string(),
})
export type SuccessStory = z.infer<typeof successStorySchema>
