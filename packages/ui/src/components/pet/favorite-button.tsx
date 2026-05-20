import { Heart } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  variant?: 'home' | 'search'
  className?: string
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  variant = 'home',
  className,
}: FavoriteButtonProps) {
  const isSearch = variant === 'search'
  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        'absolute z-10 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-colors',
        isSearch
          ? 'top-4 right-4 w-10 h-10 text-on-surface-variant hover:text-secondary'
          : 'top-3 right-3 w-8 h-8 text-outline hover:text-primary-container',
        className,
      )}
    >
      <Heart
        size={isSearch ? 20 : 18}
        fill={isFavorite ? 'currentColor' : 'none'}
        className={cn(
          isFavorite ? (isSearch ? 'text-secondary' : 'text-primary-container') : '',
        )}
      />
    </button>
  )
}
