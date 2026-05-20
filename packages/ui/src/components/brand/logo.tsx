import { PawPrint } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Logo({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 28
  const textSize =
    size === 'sm' ? 'text-[18px]' : size === 'lg' ? 'text-[36px]' : 'text-[24px]'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <PawPrint
        size={iconSize}
        strokeWidth={2}
        className="text-primary-container"
        fill="currentColor"
      />
      <span
        className={cn(
          'font-display font-bold tracking-tight text-primary-container',
          textSize,
        )}
      >
        OpenPets
      </span>
    </div>
  )
}
