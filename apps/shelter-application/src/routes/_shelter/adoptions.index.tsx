import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import type { ApplicationStatusType } from '@repo/data-utils/zod-schema/applications'
import { Icon } from '../../components/icon'
import { listApplicationsFn } from '../../lib/server-fns'

export const Route = createFileRoute('/_shelter/adoptions/')({
  loader: async () => {
    const applications = await listApplicationsFn()
    return { applications }
  },
  component: AdoptionsPage,
})

const statusStyles: Record<
  ApplicationStatusType,
  { dot: string; bg: string; text: string; label: string }
> = {
  submitted: {
    dot: 'bg-outline-variant',
    bg: 'bg-outline-variant/20 border-outline-variant/30',
    text: 'text-on-surface-variant',
    label: 'Submitted',
  },
  under_review: {
    dot: 'bg-status-warning',
    bg: 'bg-status-warning/10 border-status-warning/20',
    text: 'text-status-warning',
    label: 'Under Review',
  },
  approved: {
    dot: 'bg-status-success',
    bg: 'bg-status-success/10 border-status-success/20',
    text: 'text-status-success',
    label: 'Approved',
  },
  finalized: {
    dot: 'bg-status-success',
    bg: 'bg-status-success/10 border-status-success/20',
    text: 'text-status-success',
    label: 'Finalized',
  },
  rejected: {
    dot: 'bg-status-alert',
    bg: 'bg-status-alert/10 border-status-alert/20',
    text: 'text-status-alert',
    label: 'Rejected',
  },
  withdrawn: {
    dot: 'bg-outline',
    bg: 'bg-outline-variant/20 border-outline-variant/30',
    text: 'text-on-surface-variant',
    label: 'Withdrawn',
  },
  superseded: {
    dot: 'bg-outline',
    bg: 'bg-outline-variant/20 border-outline-variant/30',
    text: 'text-on-surface-variant',
    label: 'Superseded',
  },
}

function relativeDate(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return iso
  const diff = Date.now() - t
  const h = Math.round(diff / 36e5)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.round(h / 24)
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d} days ago`
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AdoptionsPage() {
  const { applications } = Route.useLoaderData()
  const [filter, setFilter] = React.useState<'all' | ApplicationStatusType>('all')

  const filtered = React.useMemo(
    () =>
      filter === 'all'
        ? applications
        : applications.filter((a) => a.status === filter),
    [applications, filter],
  )

  const totals = React.useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (a) => a.status === 'submitted' || a.status === 'under_review',
      ).length,
      approved: applications.filter(
        (a) => a.status === 'approved' || a.status === 'finalized',
      ).length,
    }
  }, [applications])

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">
            Adoption Management
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Review, process, and finalize incoming pet adoption applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap mb-8">
        <StatCard
          label="Total Applications"
          value={String(totals.total)}
          icon="description"
          tone="neutral"
        />
        <StatCard
          label="Pending Review"
          value={String(totals.pending)}
          suffix="awaiting"
          icon="pending_actions"
          tone="warning"
        />
        <StatCard
          label="Approved"
          value={String(totals.approved)}
          suffix="processed"
          icon="check_circle"
          tone="success"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative inline-block w-full sm:w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="w-full appearance-none bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm rounded-md py-2.5 pl-4 pr-10 focus:outline-none focus:border-primary cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="finalized">Finalized</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="superseded">Superseded</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
            <Icon name="expand_more" className="text-[20px]" />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-muted bg-surface-bright/50">
                {['Application', 'Pet', 'Date Submitted', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="py-4 px-6 text-label-sm text-on-surface-variant font-semibold tracking-wide"
                  >
                    {h}
                  </th>
                ))}
                <th className="py-4 px-6 text-label-sm text-on-surface-variant font-semibold tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-muted">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 px-6 text-center text-body-sm text-on-surface-variant"
                  >
                    No applications match this filter yet.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const s = statusStyles[a.status]
                  const cta =
                    a.status === 'finalized' ? 'View Details' : 'Review'
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-label-md text-on-surface font-mono">
                          #{a.id}
                        </div>
                        <div className="text-body-sm text-on-surface-variant font-mono">
                          Applicant: {a.applicantId}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-body-md text-on-surface font-mono">
                        {a.petId}
                      </td>
                      <td className="py-4 px-6 text-body-sm text-on-surface-variant">
                        {relativeDate(a.submittedAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm border ${s.bg} ${s.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to="/adoptions/$id"
                          params={{ id: a.id }}
                          className="inline-flex items-center justify-center h-8 px-4 border border-outline-variant rounded-md text-primary text-label-sm hover:bg-primary/5 hover:border-primary transition-colors bg-surface-container-lowest"
                        >
                          {cta}
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <ul className="md:hidden divide-y divide-surface-muted">
          {filtered.length === 0 ? (
            <li className="py-10 px-5 text-center text-body-sm text-on-surface-variant">
              No applications match this filter yet.
            </li>
          ) : (
            filtered.map((a) => {
              const s = statusStyles[a.status]
              return (
                <li key={a.id} className="relative">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 bottom-0 w-1 ${s.dot}`}
                  />
                  <Link
                    to="/adoptions/$id"
                    params={{ id: a.id }}
                    className="flex items-center gap-3 pl-5 pr-3 py-4 active:bg-surface/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="text-label-md text-on-surface truncate font-mono">
                          #{a.id}
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-none border ${s.bg} ${s.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </div>
                      <div className="text-body-sm text-on-surface truncate font-mono">
                        Pet: {a.petId}
                      </div>
                      <div className="text-body-sm text-on-surface-variant truncate mt-0.5">
                        {relativeDate(a.submittedAt)}
                      </div>
                    </div>
                    <Icon
                      name="chevron_right"
                      className="text-[20px] text-on-surface-variant shrink-0"
                    />
                  </Link>
                </li>
              )
            })
          )}
        </ul>

        <div className="border-t border-surface-muted bg-surface-container-lowest py-3 px-5 md:px-6 flex items-center justify-between">
          <p className="text-body-sm text-on-surface-variant">
            Showing {filtered.length} of {applications.length} entries
          </p>
        </div>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  suffix,
  icon,
  tone,
}: {
  label: string
  value: string
  suffix?: string
  icon: string
  tone: 'neutral' | 'warning' | 'success'
}) {
  const toneClasses = {
    neutral: {
      label: 'text-on-surface-variant',
      iconBg: 'bg-surface-container text-on-surface-variant',
      hover: 'hover:border-primary/30',
    },
    warning: {
      label: 'text-status-warning',
      iconBg: 'bg-status-warning/10 text-status-warning',
      hover: 'hover:border-status-warning/50',
    },
    success: {
      label: 'text-status-success',
      iconBg: 'bg-status-success/10 text-status-success',
      hover: 'hover:border-status-success/50',
    },
  }[tone]

  return (
    <div
      className={`bg-surface-container-lowest rounded-lg p-5 border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between transition-colors ${toneClasses.hover}`}
    >
      <div>
        <p
          className={`text-label-sm uppercase tracking-wider mb-1 font-semibold ${toneClasses.label}`}
        >
          {label}
        </p>
        <p className="text-headline-xl text-on-surface leading-tight flex items-baseline gap-2">
          {value}
          {suffix ? (
            <span className="text-body-sm text-on-surface-variant font-normal">
              {suffix}
            </span>
          ) : null}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${toneClasses.iconBg}`}
      >
        <Icon name={icon} fill className="text-[28px]" />
      </div>
    </div>
  )
}
