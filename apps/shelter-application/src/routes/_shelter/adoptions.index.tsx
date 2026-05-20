import * as React from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import type { AdoptionApplication, AdoptionStatus } from '@repo/domain'
import { Icon } from '../../components/icon'
import {
  createApplicationFn,
  listApplicationsFn,
} from '../../lib/server-fns'

export const Route = createFileRoute('/_shelter/adoptions/')({
  loader: async () => {
    const applications = await listApplicationsFn()
    return { applications }
  },
  component: AdoptionsPage,
})

const statusStyles: Record<
  AdoptionStatus,
  { dot: string; bg: string; text: string; label: string }
> = {
  review: {
    dot: 'bg-status-warning',
    bg: 'bg-status-warning/10 border-status-warning/20',
    text: 'text-status-warning',
    label: 'Under Review',
  },
  pending: {
    dot: 'bg-outline-variant',
    bg: 'bg-outline-variant/20 border-outline-variant/30',
    text: 'text-on-surface-variant',
    label: 'Pending',
  },
  approved: {
    dot: 'bg-status-success',
    bg: 'bg-status-success/10 border-status-success/20',
    text: 'text-status-success',
    label: 'Approved',
  },
  more_info: {
    dot: 'bg-status-alert',
    bg: 'bg-status-alert/10 border-status-alert/20',
    text: 'text-status-alert',
    label: 'More Info',
  },
  declined: {
    dot: 'bg-status-alert',
    bg: 'bg-status-alert/10 border-status-alert/20',
    text: 'text-status-alert',
    label: 'Declined',
  },
  completed: {
    dot: 'bg-status-success',
    bg: 'bg-status-success/10 border-status-success/20',
    text: 'text-status-success',
    label: 'Completed',
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
  const router = useRouter()
  const [filter, setFilter] = React.useState<'all' | AdoptionStatus>('all')
  const [open, setOpen] = React.useState(false)

  const filtered = React.useMemo(
    () =>
      filter === 'all'
        ? applications
        : applications.filter((a) => a.status === filter),
    [applications, filter],
  )

  const totals = React.useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      total: applications.length,
      pending: applications.filter(
        (a) => a.status === 'review' || a.status === 'pending',
      ).length,
      approvedToday: applications.filter(
        (a) => a.status === 'approved' && a.timeline[0]?.at.startsWith(today),
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
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-11 px-4 bg-primary text-on-primary rounded-md text-label-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Icon name="add" className="text-[18px]" />
          Add Applicant
        </button>
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
          label="Approved Today"
          value={String(totals.approvedToday)}
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
            <option value="review">Under Review</option>
            <option value="pending">Pending</option>
            <option value="more_info">More Info</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="completed">Completed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
            <Icon name="expand_more" className="text-[20px]" />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-muted bg-surface-bright/50">
                {['Applicant Name', 'Pet Name', 'Date Submitted', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-4 px-6 text-label-sm text-on-surface-variant font-semibold tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
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
                    a.status === 'completed' ? 'View Details' : 'Review'
                  const petLabel = a.petBreed
                    ? `${a.petName} (${a.petBreed})`
                    : a.petName
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-label-md text-on-surface">
                          {a.applicantName}
                        </div>
                        <div className="text-body-sm text-on-surface-variant">
                          {a.applicantEmail}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-body-md text-on-surface">
                        {petLabel}
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
        <div className="border-t border-surface-muted bg-surface-container-lowest py-3 px-6 flex items-center justify-between">
          <p className="text-body-sm text-on-surface-variant">
            Showing 1 to {filtered.length} of {applications.length} entries
          </p>
        </div>
      </div>

      {open ? (
        <AddApplicantDialog
          onClose={() => setOpen(false)}
          onCreated={async () => {
            setOpen(false)
            await router.invalidate()
          }}
        />
      ) : null}
    </>
  )
}

function AddApplicantDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (created: AdoptionApplication) => void
}) {
  const [form, setForm] = React.useState({
    applicantName: '',
    applicantEmail: '',
    petName: '',
    petBreed: '',
    notes: '',
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const update = (key: keyof typeof form, v: string) =>
    setForm((s) => ({ ...s, [key]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const created = await createApplicationFn({
        data: {
          applicantName: form.applicantName.trim(),
          applicantEmail: form.applicantEmail.trim(),
          petName: form.petName.trim(),
          petBreed: form.petBreed.trim() || undefined,
          notes: form.notes.trim() || undefined,
          actor: 'Shelter Staff',
        },
      })
      onCreated(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save applicant.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/30 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-muted">
          <h2 className="text-title-lg text-on-surface">Add Applicant</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <Field
            label="Applicant Name"
            value={form.applicantName}
            onChange={(v) => update('applicantName', v)}
            required
          />
          <Field
            label="Applicant Email"
            type="email"
            value={form.applicantEmail}
            onChange={(v) => update('applicantEmail', v)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Pet Name"
              value={form.petName}
              onChange={(v) => update('petName', v)}
              required
            />
            <Field
              label="Breed"
              value={form.petBreed}
              onChange={(v) => update('petBreed', v)}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          {error ? (
            <p className="text-body-sm text-status-alert">{error}</p>
          ) : null}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low text-label-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-4 rounded-md bg-primary text-on-primary text-label-md hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Add Applicant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-label-sm text-on-surface-variant mb-1.5">
        {label}
        {required ? <span className="text-status-alert ml-0.5">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary"
      />
    </div>
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
