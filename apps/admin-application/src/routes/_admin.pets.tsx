import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import {
  CheckCircle2,
  Grid3x3,
  Home,
  List,
  MapPin,
  PawPrint,
  Plus,
  Stethoscope,
} from 'lucide-react'
import { cn } from '@repo/ui'
import type { Pet, PetStatus } from '@repo/domain'
import { fetchAdminPets, fetchShelters } from '#/lib/server-fns'

export const Route = createFileRoute('/_admin/pets')({
  loader: async () => {
    const [pets, shelters] = await Promise.all([fetchAdminPets(), fetchShelters()])
    const shelterNamesById = Object.fromEntries(shelters.map((s) => [s.id, s.name]))
    return { pets, shelterNamesById }
  },
  component: PetsPage,
})

function PetsPage() {
  const { pets, shelterNamesById } = Route.useLoaderData()
  const [view, setView] = React.useState<'grid' | 'list'>('grid')
  const [urgentOnly, setUrgentOnly] = React.useState(false)

  const visible = urgentOnly ? pets.filter((p) => p.status === 'medical') : pets

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">
            Pet Directory
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage and monitor all animals across the network.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-surface-container-low rounded-lg p-1 border border-border-light">
            <ViewToggle
              active={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <Grid3x3 className="size-5" />
            </ViewToggle>
            <ViewToggle
              active={view === 'list'}
              onClick={() => setView('list')}
            >
              <List className="size-5" />
            </ViewToggle>
          </div>
          <button
            type="button"
            className="bg-primary text-on-primary px-4 h-11 rounded-lg text-label-md hover:bg-primary-container transition-colors flex items-center gap-2"
          >
            <Plus className="size-5" />
            Add Pet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FilterBlock label="Status">
          <select className="w-full border-none bg-surface-container-low rounded-lg py-2 px-3 text-body-sm focus:ring-2 focus:ring-primary text-on-surface outline-none">
            <option>All Statuses</option>
            <option>Available</option>
            <option>In Medical Care</option>
            <option>Adopted</option>
          </select>
        </FilterBlock>
        <FilterBlock label="Species">
          <select className="w-full border-none bg-surface-container-low rounded-lg py-2 px-3 text-body-sm focus:ring-2 focus:ring-primary text-on-surface outline-none">
            <option>All Species</option>
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </select>
        </FilterBlock>
        <FilterBlock label="Shelter">
          <select className="w-full border-none bg-surface-container-low rounded-lg py-2 px-3 text-body-sm focus:ring-2 focus:ring-primary text-on-surface outline-none">
            <option>All Shelters</option>
            <option>Downtown Rescue</option>
            <option>Westside Haven</option>
            <option>Lakeside Felines</option>
          </select>
        </FilterBlock>
        <button
          type="button"
          onClick={() => setUrgentOnly((v) => !v)}
          className="bg-surface-container-lowest p-4 rounded-xl border border-border-light shadow-card flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
        >
          <div>
            <span className="text-label-md text-on-surface block">
              Urgent Cases
            </span>
            <span className="text-body-sm text-on-surface-variant">
              Show medical alerts only
            </span>
          </div>
          <div
            className={cn(
              'w-10 h-6 rounded-full relative transition-colors',
              urgentOnly ? 'bg-primary' : 'bg-surface-container-high',
            )}
          >
            <div
              className={cn(
                'size-4 rounded-full absolute top-1 transition-all',
                urgentOnly
                  ? 'left-5 bg-white'
                  : 'left-1 bg-on-surface-variant',
              )}
            />
          </div>
        </button>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {visible.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              shelterName={shelterNamesById[pet.shelterId] ?? pet.shelterId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-bright border-b border-border-light">
              <tr>
                <th className="p-4 text-label-sm text-on-surface-variant">Name</th>
                <th className="p-4 text-label-sm text-on-surface-variant">Species</th>
                <th className="p-4 text-label-sm text-on-surface-variant">Shelter</th>
                <th className="p-4 text-label-sm text-on-surface-variant">Status</th>
                <th className="p-4 text-label-sm text-on-surface-variant text-right">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {visible.map((pet) => (
                <tr key={pet.id} className="hover:bg-surface-muted">
                  <td className="p-4 text-label-md text-on-surface">{pet.name}</td>
                  <td className="p-4 text-body-sm text-on-surface-variant">
                    {pet.breed} • {pet.ageLabel}
                  </td>
                  <td className="p-4 text-body-sm text-on-surface-variant">
                    {shelterNamesById[pet.shelterId] ?? pet.shelterId}
                  </td>
                  <td className="p-4">
                    <PetStatusBadge status={pet.status} />
                  </td>
                  <td className="p-4 text-right text-label-sm text-on-surface-variant">
                    #{pet.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ViewToggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded transition-colors',
        active
          ? 'bg-surface-container-lowest shadow-sm text-primary'
          : 'text-on-surface-variant hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

function FilterBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-border-light shadow-card">
      <label className="text-label-sm text-on-surface-variant block mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function PetCard({ pet, shelterName }: { pet: Pet; shelterName: string }) {
  const isAdopted = pet.status === 'adopted'
  const isMedical = pet.status === 'medical'

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-xl border overflow-hidden group cursor-pointer transition-all duration-300 relative',
        isMedical
          ? 'border-alert/30 shadow-[0_4px_16px_-4px_rgba(229,57,53,0.1)] hover:shadow-[0_8px_24px_-4px_rgba(229,57,53,0.15)]'
          : 'border-border-light shadow-card hover:shadow-card-hover',
        isAdopted && 'opacity-80',
      )}
    >
      <div className="absolute top-3 left-3 z-10">
        <PetStatusBadge status={pet.status} />
      </div>
      <div
        className={cn(
          'h-48 w-full bg-surface-container-low relative overflow-hidden',
          isAdopted && 'grayscale-[50%]',
        )}
      >
        <img
          src={pet.photos[0]}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-40" />
      </div>
      <div className="p-card-inner-padding">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-headline-md text-on-surface">
            {pet.name}
          </h3>
          <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
            ID: #{pet.id}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <PawPrint className="size-4" />
            <span className="text-body-sm">
              {pet.breed} • {pet.ageLabel}
            </span>
          </div>
          <hr className="border-border-light" />
          <div className="flex items-center gap-2 text-on-surface-variant">
            <MapPin className="size-4" />
            <span className="text-body-sm">{shelterName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PetStatusBadge({ status }: { status: PetStatus }) {
  const config: Record<
    PetStatus,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    medical: {
      label: 'Urgent Care',
      classes:
        'bg-error-container text-on-error-container border-error/20 shadow-sm',
      icon: <Stethoscope className="size-4" />,
    },
    available: {
      label: 'Available',
      classes:
        'bg-inverse-primary text-on-primary-fixed-variant border-primary-fixed/50 shadow-sm',
      icon: <CheckCircle2 className="size-4" />,
    },
    adopted: {
      label: 'Adopted',
      classes:
        'bg-surface-container-high text-on-surface-variant border-outline-variant/30 shadow-sm',
      icon: <Home className="size-4" />,
    },
  }
  const c = config[status]
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-label-sm flex items-center gap-1 border',
        c.classes,
      )}
    >
      {c.icon}
      {c.label}
    </span>
  )
}
