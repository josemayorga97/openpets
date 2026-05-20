import { ChevronDown, Pencil } from 'lucide-react'
import type { PetType } from '@repo/domain'
import { Button } from '../ui/button'

export interface SearchBarValue {
  petType?: PetType
  distance?: number
  location?: string
}

export interface SearchBarProps {
  value: SearchBarValue
  onChange: (next: SearchBarValue) => void
  onSubmit: () => void
}

const PET_TYPE_OPTIONS: { value: PetType; label: string }[] = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'other', label: 'Small Animals' },
]

const DISTANCE_OPTIONS = [25, 50, 100]

export function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <div className="bg-primary-container text-on-primary-container py-6 px-margin-mobile md:px-margin-desktop">
      <form
        className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-end"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="flex-1 w-full">
          <label className="block font-label text-[12px] font-medium uppercase tracking-[0.05em] mb-1 text-on-primary-container/80">
            Pet Type
          </label>
          <div className="relative">
            <select
              value={value.petType ?? 'dog'}
              onChange={(e) =>
                onChange({ ...value, petType: e.target.value as PetType })
              }
              className="w-full bg-surface-container-lowest text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary pl-4 pr-10 py-3 text-[16px] appearance-none"
            >
              {PET_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface pointer-events-none"
            />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block font-label text-[12px] font-medium uppercase tracking-[0.05em] mb-1 text-on-primary-container/80">
            Distance
          </label>
          <div className="relative">
            <select
              value={value.distance ?? 100}
              onChange={(e) =>
                onChange({ ...value, distance: Number(e.target.value) })
              }
              className="w-full bg-surface-container-lowest text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary pl-4 pr-10 py-3 text-[16px] appearance-none"
            >
              {DISTANCE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} miles
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface pointer-events-none"
            />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block font-label text-[12px] font-medium uppercase tracking-[0.05em] mb-1 text-on-primary-container/80">
            Location
          </label>
          <div className="relative">
            <input
              value={value.location ?? ''}
              onChange={(e) => onChange({ ...value, location: e.target.value })}
              placeholder="Zip or city"
              className="w-full bg-surface-container-lowest text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary pl-4 pr-10 py-3 text-[16px]"
              type="text"
            />
            <Pencil
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface pointer-events-none"
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" size="pill" className="w-full md:w-auto">
          Search
        </Button>
      </form>
    </div>
  )
}
