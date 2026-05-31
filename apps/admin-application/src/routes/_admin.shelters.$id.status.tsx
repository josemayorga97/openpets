import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import {
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Save,
} from 'lucide-react'
import { cn } from '@repo/ui'
import type { ShelterStatusType as ShelterStatus } from '@repo/data-utils/zod-schema/shelters'
import { fetchShelter, updateShelterStatusFn } from '#/lib/server-fns'

export const Route = createFileRoute('/_admin/shelters/$id/status')({
  loader: async ({ params }) => {
    const shelter = await fetchShelter({ data: { id: params.id } })
    if (!shelter) throw notFound()
    return { shelter }
  },
  component: ChangeStatusPage,
})

// Settable statuses via the admin status route — `pending` is not settable
// (it's only the initial state on application).
type SettableStatus = 'active' | 'suspended'

const options: {
  value: SettableStatus
  label: string
  hint: string
  tone: 'primary' | 'alert'
}[] = [
  { value: 'active', label: 'Active', hint: 'Operational', tone: 'primary' },
  {
    value: 'suspended',
    label: 'Suspended',
    hint: 'Policy violation / Temporary closure',
    tone: 'alert',
  },
]

function ChangeStatusPage() {
  const { shelter } = Route.useLoaderData()
  const router = useRouter()
  const [selected, setSelected] = React.useState<SettableStatus>(
    shelter.status === 'suspended' ? 'suspended' : 'active',
  )
  const [reason, setReason] = React.useState('')
  const [notify, setNotify] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateShelterStatusFn({
        data: {
          id: shelter.id,
          status: selected,
          reason: reason.trim() || undefined,
          notify,
        },
      })
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update status.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-12">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1 text-label-sm text-on-surface-variant">
          <li>
            <Link to="/shelters" className="hover:text-primary">
              Shelters
            </Link>
          </li>
          <li>
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link
              to="/shelters/$id/review"
              params={{ id: shelter.id }}
              className="hover:text-primary"
            >
              {shelter.name}
            </Link>
          </li>
          <li>
            <ChevronRight className="size-4" />
          </li>
          <li className="text-primary font-medium" aria-current="page">
            Change Status
          </li>
        </ol>
      </nav>
      <h1 className="font-display text-headline-lg text-on-surface">
        Change Shelter Status
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 mb-section-gap">
        Update operating status and permissions for {shelter.name}.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-bright rounded-xl border border-border-light p-card-inner-padding shadow-soft">
            <h2 className="text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">
              Current Status
            </h2>
            <CurrentStatusBox status={shelter.status} since={shelter.appliedAt} />
          </div>

          <form
            className="bg-surface-bright rounded-xl border border-border-light p-card-inner-padding shadow-soft"
            onSubmit={(e) => {
              e.preventDefault()
              void save()
            }}
          >
            <h2 className="text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">
              New Status
            </h2>
            <div className="space-y-3">
              {options.map((opt) => (
                <StatusOption
                  key={opt.value}
                  option={opt}
                  selected={selected === opt.value}
                  onSelect={() => setSelected(opt.value)}
                />
              ))}
            </div>

            <div className="mt-8">
              <label
                htmlFor="reason"
                className="block text-label-md text-on-surface mb-2"
              >
                Reason for Change
              </label>
              <textarea
                id="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter administrative notes regarding this status change…"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-outline outline-none"
              />
              <p className="text-label-sm text-on-surface-variant mt-1">
                This note will be logged in the shelter's administrative
                history.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-border-light">
              <div>
                <div className="text-label-md text-on-surface">
                  Notify Shelter via Email
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  Send an automated notification to the shelter's primary
                  contact.
                </div>
              </div>
              <Switch checked={notify} onChange={setNotify} />
            </div>

            {error ? (
              <p className="text-body-sm text-alert mt-4">{error}</p>
            ) : null}

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border-light">
              <Link
                to="/shelters"
                className="h-11 px-6 inline-flex items-center rounded-lg text-label-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="h-11 px-6 rounded-lg text-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="size-4" />
                {saving ? 'Saving…' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>

        <aside>
          <div className="bg-surface-bright rounded-xl border border-border-light p-card-inner-padding shadow-soft sticky top-24">
            <h2 className="text-label-md text-on-surface-variant mb-6 uppercase tracking-wider flex items-center gap-2">
              <History className="size-4" />
              Status History
            </h2>
            <div className="relative border-l-2 border-surface-variant ml-2 space-y-8">
              <TimelineItem
                color="bg-success"
                date="Oct 12, 2023 • 10:45 AM"
                heading={
                  <>
                    Changed to <span className="text-success">Active</span>
                  </>
                }
                note="Shelter passed initial inspection and submitted all required documentation."
                actor="System Admin"
              />
              <TimelineItem
                color="bg-warning"
                date="Oct 01, 2023 • 09:00 AM"
                heading={
                  <>
                    Changed to <span className="text-warning">Pending</span>
                  </>
                }
                note="Application received. Awaiting 501(c)(3) verification documents."
                actor="Maria Garcia"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function CurrentStatusBox({
  status,
  since,
}: {
  status: ShelterStatus
  since: string
}) {
  const map: Record<
    ShelterStatus,
    { tint: string; iconClass: string; icon: React.ReactNode; label: string; copy: string }
  > = {
    active: {
      tint: 'bg-success/20',
      iconClass: 'text-success',
      icon: <CheckCircle2 className="size-6" />,
      label: 'Active',
      copy: 'Fully operational. Can intake and adopt pets.',
    },
    pending: {
      tint: 'bg-warning/20',
      iconClass: 'text-warning',
      icon: <Clock className="size-6" />,
      label: 'Pending',
      copy: 'Under review. Limited intake permissions.',
    },
    suspended: {
      tint: 'bg-alert/20',
      iconClass: 'text-alert',
      icon: <Ban className="size-6" />,
      label: 'Suspended',
      copy: 'Suspended. No new intake or adoption activity.',
    },
  }
  const c = map[status]
  return (
    <div className="flex items-center justify-between p-4 bg-surface-muted rounded-lg border border-border-light">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            c.tint,
            c.iconClass,
          )}
        >
          {c.icon}
        </div>
        <div>
          <div className="font-display text-[18px] font-semibold text-on-surface">
            {c.label}
          </div>
          <div className="text-body-sm text-on-surface-variant">{c.copy}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-label-sm text-on-surface-variant">Since</div>
        <div className="text-body-sm font-medium">{since}</div>
      </div>
    </div>
  )
}

function StatusOption({
  option,
  selected,
  onSelect,
}: {
  option: (typeof options)[number]
  selected: boolean
  onSelect: () => void
}) {
  const tone = {
    primary: {
      ring: 'border-primary bg-primary-fixed/20',
      dotBorder: 'border-primary',
      dot: 'bg-primary',
      icon: <CheckCircle2 className="size-5 text-success" />,
    },
    warning: {
      ring: 'border-warning bg-warning/10',
      dotBorder: 'border-warning',
      dot: 'bg-warning',
      icon: <Clock className="size-5 text-warning" />,
    },
    alert: {
      ring: 'border-alert bg-alert/10',
      dotBorder: 'border-alert',
      dot: 'bg-alert',
      icon: <Ban className="size-5 text-alert" />,
    },
  }[option.tone]

  return (
    <label
      className={cn(
        'relative flex cursor-pointer rounded-lg border-2 p-4 transition-colors',
        selected
          ? tone.ring
          : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low',
      )}
    >
      <input
        type="radio"
        name="status"
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              selected ? tone.dotBorder : 'border-outline-variant',
            )}
          >
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-opacity',
                tone.dot,
                selected ? 'opacity-100' : 'opacity-0',
              )}
            />
          </div>
          <div>
            <span className="block text-label-md text-on-surface">
              {option.label}
            </span>
            <span className="block text-body-sm text-on-surface-variant mt-0.5">
              {option.hint}
            </span>
          </div>
        </div>
        {tone.icon}
      </div>
    </label>
  )
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-surface-variant',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-5 bg-white border border-gray-300 rounded-full transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

function TimelineItem({
  color,
  date,
  heading,
  note,
  actor,
}: {
  color: string
  date: string
  heading: React.ReactNode
  note: string
  actor: string
}) {
  return (
    <div className="relative pl-6">
      <div
        className={cn(
          'absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface-bright',
          color,
        )}
      />
      <div className="text-label-sm text-on-surface-variant mb-1">{date}</div>
      <div className="text-label-md text-on-surface">{heading}</div>
      <div className="text-body-sm text-on-surface-variant mt-1">{note}</div>
      <div className="flex items-center gap-2 mt-2">
        <div className="size-5 rounded-full bg-surface-container-highest flex items-center justify-center text-label-sm text-on-surface-variant">
          {actor.charAt(0)}
        </div>
        <div className="text-label-sm text-on-surface-variant">by {actor}</div>
      </div>
    </div>
  )
}
