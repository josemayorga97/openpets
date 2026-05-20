import { z } from 'zod'

const requiredString = (label: string, min = 1) =>
  z.string().trim().min(min, `${label} is required`)

const longText = (label: string) =>
  z
    .string()
    .trim()
    .min(50, `${label} must be at least 50 characters`)
    .max(1000, `${label} must be at most 1000 characters`)

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => !v || /^https?:\/\/.+/i.test(v),
    'Must be a valid URL starting with http(s)://',
  )

export const aboutAdoptionsSchema = z.object({
  petsAvailable: requiredString('This field'),
  acquisitionDescription: longText('Acquisition description'),
  hasAdoptionContract: z.enum(['yes', 'no']),
  feeMin: z.string().optional(),
  feeMax: z.string().optional(),
  spayPolicy: z.enum(['usual', 'exceptions', 'adopters', 'na']),
  sterilizationApproach: longText('Sterilization approach'),
  medicalCareDescription: longText('Medical care description'),
})

export const aboutYouSchema = z.object({
  firstName: requiredString('First name'),
  lastName: requiredString('Last name'),
  email: z.string().email('Enter a valid email'),
  phone: requiredString('Phone'),
  personalCountry: requiredString('Country'),
  personalAddress1: requiredString('Address'),
  personalAddress2: z.string().optional(),
  personalCity: requiredString('City'),
  personalState: requiredString('State'),
  personalZip: requiredString('Zip'),
})

export const aboutOrganizationSchema = z
  .object({
    orgType: requiredString('Organization type'),
    orgName: requiredString('Organization name'),
    contactName: requiredString('Contact name'),
    orgPhone: z.string().optional().default(''),
    orgEmail: z.string().optional().default(''),
    taxId: z.string().optional(),
    physCountry: requiredString('Country'),
    physAddress1: requiredString('Address'),
    physAddress2: z.string().optional(),
    physCity: requiredString('City'),
    physState: requiredString('State'),
    physZip: requiredString('Zip'),
    mailCountry: requiredString('Country'),
    mailAddress1: requiredString('Address'),
    mailIsPublic: z.enum(['yes', 'no']),
  })
  .refine((data) => data.orgPhone.trim() || data.orgEmail.trim(), {
    message: 'Provide at least a phone or email for the organization',
    path: ['orgPhone'],
  })

export const moreDetailsSchema = z.object({
  animals: z
    .array(z.string())
    .min(1, 'Select at least one animal type'),
  missionStatement: longText('Mission statement'),
  adoptionApplicationUrl: optionalUrl,
  adoptionPolicies: longText('Adoption policies'),
  specialServices: z.array(z.string()).default([]),
  websiteUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  xUrl: optionalUrl,
  otherUrl: optionalUrl,
})

export const agreementSchema = z.object({
  agreement1: z.literal(true, { message: 'Required' }),
  agreement2: z.literal(true, { message: 'Required' }),
  agreement3: z.literal(true, { message: 'Required' }),
  agreement4: z.literal(true, { message: 'Required' }),
  agreementTerms: z.literal(true, { message: 'Required' }),
})

export const applicationSchema = aboutAdoptionsSchema
  .and(aboutYouSchema)
  .and(aboutOrganizationSchema)
  .and(moreDetailsSchema)
  .and(agreementSchema)

export type ApplicationValues = {
  // adoptions
  petsAvailable: string
  acquisitionDescription: string
  hasAdoptionContract: 'yes' | 'no' | ''
  feeMin: string
  feeMax: string
  spayPolicy: 'usual' | 'exceptions' | 'adopters' | 'na' | ''
  sterilizationApproach: string
  medicalCareDescription: string
  // you
  firstName: string
  lastName: string
  email: string
  phone: string
  personalCountry: string
  personalAddress1: string
  personalAddress2: string
  personalCity: string
  personalState: string
  personalZip: string
  // organization
  orgType: string
  orgName: string
  contactName: string
  orgPhone: string
  orgEmail: string
  taxId: string
  physCountry: string
  physAddress1: string
  physAddress2: string
  physCity: string
  physState: string
  physZip: string
  mailCountry: string
  mailAddress1: string
  mailIsPublic: 'yes' | 'no' | ''
  // more details
  animals: Array<string>
  missionStatement: string
  adoptionApplicationUrl: string
  adoptionPolicies: string
  specialServices: Array<string>
  websiteUrl: string
  facebookUrl: string
  instagramUrl: string
  youtubeUrl: string
  xUrl: string
  otherUrl: string
  // agreement
  agreement1: boolean
  agreement2: boolean
  agreement3: boolean
  agreement4: boolean
  agreementTerms: boolean
}

export const defaultApplicationValues: ApplicationValues = {
  petsAvailable: '',
  acquisitionDescription: '',
  hasAdoptionContract: '',
  feeMin: '',
  feeMax: '',
  spayPolicy: '',
  sterilizationApproach: '',
  medicalCareDescription: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  personalCountry: '',
  personalAddress1: '',
  personalAddress2: '',
  personalCity: '',
  personalState: '',
  personalZip: '',
  orgType: '',
  orgName: '',
  contactName: '',
  orgPhone: '',
  orgEmail: '',
  taxId: '',
  physCountry: '',
  physAddress1: '',
  physAddress2: '',
  physCity: '',
  physState: '',
  physZip: '',
  mailCountry: '',
  mailAddress1: '',
  mailIsPublic: '',
  animals: [],
  missionStatement: '',
  adoptionApplicationUrl: '',
  adoptionPolicies: '',
  specialServices: [],
  websiteUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  xUrl: '',
  otherUrl: '',
  agreement1: false,
  agreement2: false,
  agreement3: false,
  agreement4: false,
  agreementTerms: false,
}

export const stepFieldGroups: Record<string, Array<keyof ApplicationValues>> = {
  'about-adoptions': [
    'petsAvailable',
    'acquisitionDescription',
    'hasAdoptionContract',
    'feeMin',
    'feeMax',
    'spayPolicy',
    'sterilizationApproach',
    'medicalCareDescription',
  ],
  'about-you': [
    'firstName',
    'lastName',
    'email',
    'phone',
    'personalCountry',
    'personalAddress1',
    'personalAddress2',
    'personalCity',
    'personalState',
    'personalZip',
  ],
  'about-organization': [
    'orgType',
    'orgName',
    'contactName',
    'orgPhone',
    'orgEmail',
    'taxId',
    'physCountry',
    'physAddress1',
    'physAddress2',
    'physCity',
    'physState',
    'physZip',
    'mailCountry',
    'mailAddress1',
    'mailIsPublic',
  ],
  'more-details': [
    'animals',
    'missionStatement',
    'adoptionApplicationUrl',
    'adoptionPolicies',
    'specialServices',
    'websiteUrl',
    'facebookUrl',
    'instagramUrl',
    'youtubeUrl',
    'xUrl',
    'otherUrl',
  ],
  agreement: [
    'agreement1',
    'agreement2',
    'agreement3',
    'agreement4',
    'agreementTerms',
  ],
}

export const stepValidators: Record<string, z.ZodTypeAny> = {
  'about-adoptions': aboutAdoptionsSchema,
  'about-you': aboutYouSchema,
  'about-organization': aboutOrganizationSchema,
  'more-details': moreDetailsSchema,
  agreement: agreementSchema,
}
