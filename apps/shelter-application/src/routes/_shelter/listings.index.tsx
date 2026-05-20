import { createFileRoute, Link } from '@tanstack/react-router'
import { pets } from '@repo/mock-data'
import { Icon } from '../../components/icon'

export const Route = createFileRoute('/_shelter/listings/')({
  component: ListingsPage,
})

type Status = 'adoptable' | 'pending' | 'draft'

const statusStyles: Record<Status, { dot: string; text: string; label: string }> = {
  adoptable: {
    dot: 'bg-status-success',
    text: 'text-status-success border-status-success/20',
    label: 'Adoptable',
  },
  pending: {
    dot: 'bg-status-warning',
    text: 'text-status-warning border-status-warning/20',
    label: 'Pending',
  },
  draft: {
    dot: 'bg-outline',
    text: 'text-on-surface-variant border-outline-variant',
    label: 'Draft',
  },
}

function pickStatus(idx: number): Status {
  if (idx % 5 === 2) return 'draft'
  if (idx % 3 === 1) return 'pending'
  return 'adoptable'
}

function ListingsPage() {
  const items = pets.slice(0, 12).map((p, i) => ({
    pet: p,
    status: pickStatus(i),
  }))

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-headline-lg text-on-background mb-2">
            Pet Listings
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Manage and organize all animal records in your shelter.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-11 px-4 rounded-md border border-primary text-primary text-label-md flex items-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <Icon name="upload" className="text-[18px]" />
            Import Pets
          </button>
          <Link
            to="/listings/new"
            className="h-11 px-4 rounded-md bg-primary text-on-primary text-label-md flex items-center gap-2 shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="add" className="text-[18px]" />
            New Listing
          </Link>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
        <div className="flex-1 min-w-[200px] relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
          />
          <input
            type="text"
            placeholder="Search by name, ID, or microchip..."
            className="w-full pl-10 pr-4 h-11 bg-surface border border-outline-variant rounded-md text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="h-11 pl-4 pr-10 bg-surface border border-outline-variant rounded-md text-body-sm text-on-background focus:border-primary outline-none">
            <option>All Statuses</option>
            <option>Adoptable</option>
            <option>Pending</option>
            <option>Draft</option>
          </select>
          <select className="h-11 pl-4 pr-10 bg-surface border border-outline-variant rounded-md text-body-sm text-on-background focus:border-primary outline-none">
            <option>All Species</option>
            <option>Dog</option>
            <option>Cat</option>
            <option>Other</option>
          </select>
        </div>
        <button
          type="button"
          className="h-11 px-4 rounded-md bg-surface border border-outline-variant text-on-surface-variant text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors"
        >
          <Icon name="filter_list" className="text-[18px]" />
          More Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-container-margin">
        {items.map(({ pet, status }) => {
          const s = statusStyles[status]
          const photo = pet.photos?.[0]
          return (
            <div
              key={pet.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)] transition-shadow group flex flex-col"
            >
              <div className="h-48 w-full relative overflow-hidden bg-surface-variant flex items-center justify-center">
                {photo ? (
                  <img
                    src={photo}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Icon name="image" className="text-[48px] text-outline" />
                )}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full border ${s.text} flex items-center gap-1.5`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-label-sm">{s.label}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-headline-md text-on-background">
                    {pet.name}
                  </h3>
                  <button
                    type="button"
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Icon name="more_vert" className="text-[20px]" />
                  </button>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-4 capitalize">
                  {pet.type} • {pet.breed} • {pet.ageLabel}
                </p>
                <div className="mt-auto pt-4 border-t border-surface-muted flex justify-between items-center">
                  <span className="text-label-sm text-outline">
                    ID: #{pet.id.toUpperCase()}
                  </span>
                  <span className="text-label-sm text-outline">
                    Posted {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-outline-variant pt-6">
        <p className="text-body-sm text-on-surface-variant">
          Showing 1 to {items.length} of 48 listings
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="h-10 w-10 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant disabled:opacity-50"
          >
            <Icon name="chevron_left" className="text-[20px]" />
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-md bg-primary text-on-primary text-label-md"
          >
            1
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-md border border-outline-variant text-on-background text-label-md hover:bg-surface-container-low transition-colors"
          >
            2
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-md border border-outline-variant text-on-background text-label-md hover:bg-surface-container-low transition-colors"
          >
            3
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-md border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
        </div>
      </div>
    </>
  )
}
