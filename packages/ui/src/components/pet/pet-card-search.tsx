import { Link } from '@tanstack/react-router'
import { FileText, PawPrint } from 'lucide-react'
import type { PublicPet as Pet } from '@repo/api-client'
import { FavoriteButton } from './favorite-button'

export interface PetCardSearchProps {
  pet: Pet
  isFavorite: boolean
  onFavoriteClick: (pet: Pet) => void
}

export function PetCardSearch({ pet, isFavorite, onFavoriteClick }: PetCardSearchProps) {
  const distanceLabel = pet.outOfTown
    ? pet.transportAvailable
      ? 'Transport Available'
      : 'Out of town'
    : pet.location.distanceMiles != null
      ? `${pet.location.distanceMiles} mile${pet.location.distanceMiles === 1 ? '' : 's'} away`
      : `${pet.location.city}, ${pet.location.state}`

  const ageLabel =
    pet.age === 'puppy'
      ? 'Puppy'
      : pet.age === 'young'
        ? 'Young'
        : pet.age === 'adult'
          ? 'Adult'
          : 'Senior'
  const genderLabel = pet.gender === 'male' ? 'Male' : 'Female'

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,36,41,0.08)] shadow-[0_4px_20px_rgba(0,36,41,0.05)] transition-all duration-300 relative">
      {pet.outOfTown && (
        <div className="absolute top-4 left-0 bg-primary text-on-primary font-label text-[12px] font-medium tracking-[0.08em] uppercase py-1 px-3 rounded-r-lg z-10 shadow-sm">
          Out of Town
        </div>
      )}
      <div className="relative h-64 overflow-hidden">
        {pet.photos[0] ? (
          <img
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={pet.photos[0]}
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <PawPrint size={56} className="text-outline-variant" />
          </div>
        )}
        <FavoriteButton
          variant="search"
          isFavorite={isFavorite}
          onToggle={() => onFavoriteClick(pet)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="font-display text-[24px] font-semibold text-white">{pet.name}</h3>
          <p className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-white/90">
            {distanceLabel}
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[16px] text-on-surface mb-2">
          {ageLabel} • {genderLabel}
        </p>
        <p className="text-[16px] text-on-surface-variant truncate mb-4">{pet.breed}</p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant gap-2">
          <Link
            to="/pets/$id"
            params={{ id: pet.id }}
            className="bg-primary text-on-primary font-label text-[12px] font-medium uppercase tracking-[0.05em] py-2 px-4 rounded-full hover:bg-primary-container transition-colors text-center flex-1"
          >
            View Profile
          </Link>
          <Link
            to="/pets/$id"
            params={{ id: pet.id }}
            className="flex items-center justify-center gap-1 text-primary font-label text-[12px] font-medium uppercase tracking-[0.05em] py-2 px-2 hover:bg-surface-container-low rounded transition-colors whitespace-nowrap"
          >
            <FileText size={14} /> Fast Facts
          </Link>
        </div>
      </div>
    </div>
  )
}
