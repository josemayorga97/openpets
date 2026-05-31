import { Link } from '@tanstack/react-router'
import { Cake, ChevronDown, PawPrint, Ruler, Users } from 'lucide-react'
import * as React from 'react'
import type {
  AgeType as AgeBucket,
  SizeType as Size,
} from '@repo/data-utils/zod-schema/pets'
import { cn } from '../../lib/utils'
import { Checkbox } from '../ui/checkbox'

export interface FiltersValue {
  breeds: string[]
  ages: AgeBucket[]
  sizes: Size[]
  includeOutOfTown: boolean
}

export interface FiltersSidebarProps {
  filters: FiltersValue
  breeds: string[]
  onChange: (next: FiltersValue) => void
  onClear: () => void
}

const AGE_OPTIONS: { value: AgeBucket; label: string }[] = [
  { value: 'puppy', label: 'Puppy' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
]
const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'Extra Large' },
]

function FilterGroup({
  icon: Icon,
  label,
  defaultOpen = true,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center p-4 hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-primary" />
          <span className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-on-surface">
            {label}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={cn(
            'text-on-surface-variant transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={(c) => onChange(!!c)} />
      <span className="text-[16px] text-on-surface">{label}</span>
    </label>
  )
}

export function FiltersSidebar({ filters, breeds, onChange, onClear }: FiltersSidebarProps) {
  const toggle = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  return (
    <aside className="w-full md:w-64 flex-shrink-0 hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-[24px] font-semibold text-on-surface">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary hover:text-primary-container transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-4">
        <FilterGroup icon={PawPrint} label="Breed">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {breeds.map((b) => (
              <CheckRow
                key={b}
                id={`breed-${b}`}
                label={b}
                checked={filters.breeds.includes(b)}
                onChange={() => onChange({ ...filters, breeds: toggle(filters.breeds, b) })}
              />
            ))}
          </div>
        </FilterGroup>
        <FilterGroup icon={Cake} label="Age">
          <div className="space-y-2">
            {AGE_OPTIONS.map((a) => (
              <CheckRow
                key={a.value}
                id={`age-${a.value}`}
                label={a.label}
                checked={filters.ages.includes(a.value)}
                onChange={() => onChange({ ...filters, ages: toggle(filters.ages, a.value) })}
              />
            ))}
          </div>
        </FilterGroup>
        <FilterGroup icon={Ruler} label="Size">
          <div className="space-y-2">
            {SIZE_OPTIONS.map((s) => (
              <CheckRow
                key={s.value}
                id={`size-${s.value}`}
                label={s.label}
                checked={filters.sizes.includes(s.value)}
                onChange={() => onChange({ ...filters, sizes: toggle(filters.sizes, s.value) })}
              />
            ))}
          </div>
        </FilterGroup>
      </div>
      <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={filters.includeOutOfTown}
            onCheckedChange={(c) =>
              onChange({ ...filters, includeOutOfTown: !!c })
            }
            className="mt-1"
          />
          <div className="flex flex-col">
            <span className="text-[16px] text-on-surface">
              Include out-of-town pets that can be transported to your area
            </span>
            <a className="font-label text-[12px] font-medium uppercase tracking-[0.05em] text-primary hover:underline mt-1" href="#">
              How transporting pets to your area works
            </a>
          </div>
        </label>
      </div>
      <Link
        to="/quiz"
        className="mt-8 block bg-primary text-on-primary rounded-xl overflow-hidden shadow-md group cursor-pointer hover:-translate-y-1 transition-transform duration-300"
      >
        <div className="h-24 bg-surface-container relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-end opacity-50">
            <Users size={88} className="text-primary-container -mb-4" />
          </div>
        </div>
        <div className="p-6 text-center flex flex-col justify-center relative z-10">
          <h3 className="font-display text-[20px] font-semibold mb-2">
            Find Your Best Match
          </h3>
          <p className="text-[14px] opacity-90 mb-4">It only takes 60 seconds!</p>
          <span className="bg-on-primary text-primary font-label text-[12px] font-medium uppercase tracking-[0.05em] py-2 px-6 rounded-full w-full group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
            Get Started
          </span>
        </div>
      </Link>
    </aside>
  )
}
