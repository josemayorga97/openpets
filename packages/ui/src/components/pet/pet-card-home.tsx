import { Link } from '@tanstack/react-router'
import { MapPin, PawPrint } from 'lucide-react'
import type { Pet } from '@repo/domain'
import { Badge } from '../ui/badge'
import { FavoriteButton } from './favorite-button'

const TYPE_LABEL: Record<Pet['type'], string> = {
  dog: 'Dog',
  cat: 'Cat',
  other: 'Other',
}

export interface PetCardHomeProps {
  pet: Pet
  isFavorite: boolean
  onFavoriteClick: (pet: Pet) => void
}

export function PetCardHome({ pet, isFavorite, onFavoriteClick }: PetCardHomeProps) {
  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-surface-variant relative group flex flex-col h-full shadow-[0_4px_20px_rgba(0,36,41,0.05)] hover:shadow-[0_8px_30px_rgba(0,36,41,0.08)] hover:-translate-y-0.5 transition-all duration-300">
      <FavoriteButton
        variant="home"
        isFavorite={isFavorite}
        onToggle={() => onFavoriteClick(pet)}
      />
      <Link to="/pets/$id" params={{ id: pet.id }} className="flex flex-col flex-1">
        <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container flex items-center justify-center">
          {pet.photos[0] ? (
            <img
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={pet.photos[0]}
            />
          ) : (
            <PawPrint size={48} className="text-outline-variant" />
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between border-t border-surface-variant">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display text-[24px] font-semibold text-on-surface">
                {pet.name}
              </h3>
              <Badge>{TYPE_LABEL[pet.type]}</Badge>
            </div>
            <p className="text-[16px] text-on-surface-variant mb-4">
              {pet.breed} • {pet.ageLabel}
            </p>
          </div>
          <div className="flex items-center text-outline font-label text-[12px] font-medium uppercase tracking-[0.05em] gap-1">
            <MapPin size={16} /> {pet.location.city}, {pet.location.state}
          </div>
        </div>
      </Link>
    </div>
  )
}
