import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@repo/ui'
import { fetchDashboard } from '#/lib/server-fns'

export const Route = createFileRoute('/_admin/')({
  loader: () => fetchDashboard(),
  component: DashboardPage,
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

function DashboardPage() {
  const { counts, pendingShelters: pending } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-section-gap pb-12">
      <header>
        <h2 className="font-display text-headline-lg text-on-surface">
          Overview
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          Platform metrics and pending administrative tasks.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <MetricCard
          label="Total Shelters"
          value={String(counts.total)}
          icon={Building2}
        />
        <MetricCard
          label="Pending Approvals"
          value={String(counts.pending)}
          icon={ShieldCheck}
          highlight
          subtitle="Requires Action"
          subtitleClassName="text-warning"
        />
        <MetricCard
          label="Active Shelters"
          value={String(counts.active)}
          icon={CheckCircle2}
          iconTone="success"
        />
        <MetricCard
          label="Suspended"
          value={String(counts.suspended)}
          icon={ClipboardList}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <section className="lg:col-span-12 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="px-card-inner-padding py-4 border-b border-border-light flex justify-between items-center">
            <h3 className="font-display text-headline-md text-on-surface">
              Pending Shelter Approvals
            </h3>
            <Link
              to="/shelters"
              className="text-label-sm text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light bg-surface-muted/50">
                  <Th>Shelter Name</Th>
                  <Th>Location</Th>
                  <Th>Applied</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="text-body-sm divide-y divide-border-light">
                {pending.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-surface-muted/40 transition-colors group"
                  >
                    <td className="px-card-inner-padding py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                          <Building2 className="size-4" />
                        </div>
                        <span className="font-semibold text-on-surface">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-card-inner-padding py-4 text-on-surface-variant">
                      {s.city}, {s.region}
                    </td>
                    <td className="px-card-inner-padding py-4 text-on-surface-variant">
                      {formatDate(s.appliedAt)}
                    </td>
                    <td className="px-card-inner-padding py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to="/shelters/$id/review"
                          params={{ id: s.id }}
                          className="h-9 px-4 inline-flex items-center text-label-md text-primary border border-primary/30 hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          Review
                        </Link>
                        <button
                          type="button"
                          className="h-9 px-4 text-label-md text-on-primary bg-primary hover:bg-primary-container rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
        'px-card-inner-padding py-3 text-label-sm text-on-surface-variant font-semibold',
        className,
      )}
    >
      {children}
    </th>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  iconTone = 'primary',
  trend,
  subtitle,
  subtitleClassName,
  highlight,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  iconTone?: 'primary' | 'success' | 'warning'
  trend?: { value: number; positive: boolean }
  subtitle?: string
  subtitleClassName?: string
  highlight?: boolean
}) {
  const toneStyles = {
    primary: 'bg-primary/5 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }
  const tone = highlight ? 'warning' : iconTone
  return (
    <div
      className={cn(
        'glass-card rounded-xl p-card-inner-padding flex flex-col justify-between min-h-40',
        highlight && 'border-warning/30 bg-warning/5',
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-label-md text-on-surface-variant">{label}</span>
        <div className={cn('p-2 rounded-lg', toneStyles[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-end gap-3">
          <h3 className="font-display text-headline-xl text-on-surface leading-none">
            {value}
          </h3>
          {trend && (
            <span className="flex items-center text-success text-label-sm mb-1">
              <TrendingUp className="size-4 mr-1" />
              +{trend.value}%
            </span>
          )}
          {subtitle && !trend && (
            <span
              className={cn(
                'text-label-sm mb-1 text-on-surface-variant',
                subtitleClassName,
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
        {subtitle && trend === undefined && !subtitleClassName ? null : null}
        {subtitle && !trend ? null : null}
      </div>
    </div>
  )
}
