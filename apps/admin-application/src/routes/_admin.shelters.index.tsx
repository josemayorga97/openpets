import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  Filter,
  Plus,
  Eye,
  Pencil,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@repo/ui'
import type { ShelterStatusType as ShelterStatus } from '@repo/data-utils/zod-schema/shelters'
import { fetchShelters } from '#/lib/server-fns'

export const Route = createFileRoute('/_admin/shelters/')({
  loader: () => fetchShelters(),
  component: SheltersPage,
})

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function SheltersPage() {
  const shelters = Route.useLoaderData()
  const totals = {
    total: shelters.length,
    active: shelters.filter((s) => s.status === 'active').length,
    pending: shelters.filter((s) => s.status === 'pending').length,
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">
            Shelter Management
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Oversee, filter, and manage all registered partner shelters.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-primary text-on-primary text-label-md px-5 h-11 rounded-lg hover:bg-primary-container transition-colors"
        >
          <Plus className="size-5" />
          Register Shelter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard
          label="Total Facilities"
          value={String(totals.total)}
          icon={Building2}
        />
        <StatCard
          label="Active Status"
          value={String(totals.active)}
          tone="success"
          unit="operational"
          icon={CheckCircle2}
        />
        <StatCard
          label="Pending Review"
          value={String(totals.pending)}
          tone="warning"
          unit="awaiting approval"
          icon={ClipboardList}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-soft flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border-light bg-surface-bright flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterSelect>
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Suspended</option>
            </FilterSelect>
            <FilterSelect className="hidden sm:flex">
              <option>All Regions</option>
              <option>North District</option>
              <option>South District</option>
              <option>East District</option>
              <option>West District</option>
            </FilterSelect>
          </div>
          <div className="flex gap-2">
            <IconBtn>
              <Filter className="size-5" />
            </IconBtn>
            <IconBtn>
              <Download className="size-5" />
            </IconBtn>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-bright border-b border-border-light">
                <Th>Shelter Name</Th>
                <Th>Contact</Th>
                <Th>Status</Th>
                <Th>Location</Th>
                <Th>Applied</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {shelters.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-surface-muted transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-label-md text-on-surface">
                        {s.name}
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        {s.slug}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-body-sm text-on-surface">
                    {s.email ?? s.phone ?? '—'}
                  </td>
                  <td className="p-4">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="p-4 text-body-sm text-on-surface-variant">
                    {s.city}, {s.region}
                  </td>
                  <td className="p-4 text-body-sm text-on-surface-variant">
                    {formatDate(s.appliedAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to="/shelters/$id/review"
                        params={{ id: s.id }}
                        className="text-on-surface-variant hover:text-primary p-2 rounded transition-colors"
                        aria-label="Review"
                      >
                        <Eye className="size-5" />
                      </Link>
                      <Link
                        to="/shelters/$id/status"
                        params={{ id: s.id }}
                        className="text-on-surface-variant hover:text-primary p-2 rounded transition-colors"
                        aria-label="Change status"
                      >
                        <Pencil className="size-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border-light bg-surface-container-lowest flex items-center justify-between">
          <span className="text-body-sm text-on-surface-variant">
            Showing 1 to {shelters.length} of {shelters.length} entries
          </span>
          <div className="flex gap-1">
            <PageBtn disabled>Prev</PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <span className="px-2 py-1 text-on-surface-variant">…</span>
            <PageBtn>Next</PageBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        'p-4 text-label-sm text-on-surface-variant font-medium',
        className,
      )}
    >
      {children}
    </th>
  )
}

function StatCard({
  label,
  value,
  unit,
  tone = 'primary',
  icon: Icon,
}: {
  label: string
  value: string
  unit?: string
  tone?: 'primary' | 'success' | 'warning'
  icon: React.ComponentType<{ className?: string }>
}) {
  const valueTone = {
    primary: 'text-on-surface',
    success: 'text-success',
    warning: 'text-warning',
  }[tone]
  const iconTone = {
    primary: 'bg-surface-container text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }[tone]

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-border-light p-card-inner-padding shadow-soft flex items-center justify-between">
      <div>
        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={cn(
            'font-display text-headline-md flex items-baseline gap-2',
            valueTone,
          )}
        >
          {value}
          {unit && (
            <span className="text-body-sm text-on-surface-variant font-normal">
              {unit}
            </span>
          )}
        </p>
      </div>
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          iconTone,
        )}
      >
        <Icon className="size-6" />
      </div>
    </div>
  )
}

export function StatusPill({ status }: { status: ShelterStatus }) {
  const config: Record<
    ShelterStatus,
    { label: string; classes: string; dot: string }
  > = {
    active: {
      label: 'Active',
      classes: 'border-success/30 bg-success/5 text-success',
      dot: 'bg-success',
    },
    pending: {
      label: 'Pending',
      classes: 'border-warning/30 bg-warning/5 text-warning',
      dot: 'bg-warning',
    },
    suspended: {
      label: 'Suspended',
      classes: 'border-alert/30 bg-alert/5 text-alert',
      dot: 'bg-alert',
    },
  }
  const c = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-label-sm',
        c.classes,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  )
}

function FilterSelect({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative min-w-[200px] flex', className)}>
      <select className="w-full appearance-none bg-surface-container-lowest border border-border-light rounded-lg pl-4 pr-10 py-2.5 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
        {children}
      </select>
      <ChevronDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
    </div>
  )
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="p-2.5 border border-border-light rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
    >
      {children}
    </button>
  )
}

function PageBtn({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'px-3 py-1 rounded text-body-sm transition-colors',
        active
          ? 'bg-primary text-on-primary'
          : 'border border-border-light text-on-surface hover:bg-surface-container-low',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}
