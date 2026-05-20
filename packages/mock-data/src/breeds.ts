import type { PetType } from '@repo/domain'

export const breedsByType: Record<PetType, string[]> = {
  dog: [
    'Labrador Retriever',
    'German Shepherd',
    'Golden Retriever',
    'Pit Bull Terrier',
    'Australian Shepherd',
    'Pointer',
    'American Staffordshire Terrier',
    'Bulldog',
    'Australian Cattle Dog / Blue Heeler',
    'Shepherd',
    'Black Labrador Retriever',
    'Beagle',
    'Boxer',
    'Border Collie',
    'Husky',
  ],
  cat: [
    'Domestic Shorthair',
    'Siamese',
    'Maine Coon',
    'Persian',
    'Tabby',
    'Ragdoll',
    'British Shorthair',
  ],
  other: ['Rabbit', 'Guinea Pig', 'Hamster', 'Ferret', 'Parrot'],
}

export const allBreeds = Array.from(
  new Set(Object.values(breedsByType).flat()),
).sort()
