import * as React from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import type {
  AdoptionApplication,
  AdoptionStatus,
  AdoptionTimelineEntry,
} from '@repo/domain'
import { Icon } from '../../components/icon'
import {
  getApplicationFn,
  updateApplicationStatusFn,
} from '../../lib/server-fns'

export const Route = createFileRoute('/_shelter/adoptions/$id')({
  loader: async ({ params }) => {
    const application = await getApplicationFn({ data: { id: params.id } })
    if (!application) throw notFound()
    return { application }
  },
  component: ReviewApplicationPage,
})

const currentStatusStyle: Record<
  AdoptionStatus,
  { iconBg: string; icon: string; iconColor: string; label: string }
> = {
  pending: {
    iconBg: 'bg-status-warning/15',
    iconColor: 'text-status-warning',
    icon: 'pending_actions',
    label: 'Pending',
  },
  review: {
    iconBg: 'bg-status-warning/15',
    iconColor: 'text-status-warning',
    icon: 'pending_actions',
    label: 'Pending Review',
  },
  approved: {
    iconBg: 'bg-status-success/15',
    iconColor: 'text-status-success',
    icon: 'check_circle',
    label: 'Approved',
  },
  more_info: {
    iconBg: 'bg-status-alert/15',
    iconColor: 'text-status-alert',
    icon: 'help',
    label: 'More Info Requested',
  },
  declined: {
    iconBg: 'bg-status-alert/15',
    iconColor: 'text-status-alert',
    icon: 'cancel',
    label: 'Declined',
  },
  completed: {
    iconBg: 'bg-status-success/15',
    iconColor: 'text-status-success',
    icon: 'task_alt',
    label: 'Completed',
  },
}

type ChoiceStatus = 'approved' | 'more_info' | 'declined'

const statusChoices: Array<{
  value: ChoiceStatus
  title: string
  hint: string
  icon: string
  iconColor: string
}> = [
  {
    value: 'approved',
    title: 'Approve Adoption',
    hint: 'Applicant meets all requirements.',
    icon: 'check_circle',
    iconColor: 'text-status-success',
  },
  {
    value: 'more_info',
    title: 'Request More Info',
    hint: 'Missing telephone contact or vet records.',
    icon: 'help',
    iconColor: 'text-on-surface-variant',
  },
  {
    value: 'declined',
    title: 'Decline',
    hint: 'Applicant does not meet criteria.',
    icon: 'cancel',
    iconColor: 'text-status-alert',
  },
]

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function ReviewApplicationPage() {
  const { application } = Route.useLoaderData()
  const router = useRouter()
  const [selected, setSelected] = React.useState<ChoiceStatus>(
    application.status === 'approved'
      ? 'approved'
      : application.status === 'declined'
        ? 'declined'
        : application.status === 'more_info'
          ? 'more_info'
          : 'more_info',
  )
  const [notes, setNotes] = React.useState(application.notes ?? '')
  const [notify, setNotify] = React.useState(application.notify ?? true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const status = currentStatusStyle[application.status]

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateApplicationStatusFn({
        data: {
          id: application.id,
          status: selected,
          notes: notes.trim() || undefined,
          notify,
          actor: 'System Admin',
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
    <>
      <Breadcrumbs application={application} />

      <div className="mb-8">
        <h1 className="text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">
          Review Adoption Application
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Reviewing application for{' '}
          <span className="font-semibold text-on-surface">
            {application.applicantName}
          </span>{' '}
          to adopt{' '}
          <span className="font-semibold text-on-surface">
            &lsquo;{application.petName}&rsquo;
          </span>
          {application.petBreed ? ` the ${application.petBreed}` : null}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <section>
            <SectionLabel>Current Status</SectionLabel>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${status.iconBg}`}
              >
                <Icon
                  name={status.icon}
                  fill
                  className={`text-[26px] ${status.iconColor}`}
                />
              </div>
              <div className="flex-1">
                <p className="text-title-lg text-on-surface">{status.label}</p>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Application received. Background check in progress.
                </p>
              </div>
              <div className="text-right">
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Submitted
                </p>
                <p className="text-body-md text-on-surface mt-0.5">
                  {formatShortDate(application.submittedAt)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>Change Status</SectionLabel>
            <div className="space-y-3">
              {statusChoices.map((choice) => {
                const isSelected = selected === choice.value
                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => setSelected(choice.value)}
                    className={`w-full text-left bg-surface-container-lowest rounded-lg border p-4 flex items-center gap-4 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                      isSelected
                        ? 'border-primary'
                        : 'border-outline-variant/50 hover:border-outline-variant'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-primary'
                          : 'border-outline-variant'
                      }`}
                    >
                      {isSelected ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <div className="flex-1">
                      <p className="text-label-md text-on-surface">
                        {choice.title}
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {choice.hint}
                      </p>
                    </div>
                    <Icon
                      name={choice.icon}
                      fill
                      className={`text-[24px] ${choice.iconColor}`}
                    />
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <SectionLabel>Reviewer Notes</SectionLabel>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Enter administrative notes regarding this status change…"
              className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] resize-none"
            />
            <p className="mt-2 text-body-sm text-on-surface-variant">
              This note will be logged in the application history.
            </p>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div>
              <p className="text-label-md text-on-surface">
                Notify Applicant via Email
              </p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Send an automated notification to {application.applicantName}.
              </p>
            </div>
            <Toggle
              checked={notify}
              onChange={setNotify}
              label="Notify applicant via email"
            />
          </section>

          {error ? (
            <p className="text-body-sm text-status-alert">{error}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/adoptions"
              className="h-11 px-5 inline-flex items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container-low text-label-md"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="h-11 px-5 rounded-md bg-primary text-on-primary text-label-md hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Confirm Status Change'}
            </button>
          </div>
        </div>

        <aside className="space-y-3">
          <SectionLabel>Timeline</SectionLabel>
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
            <Timeline entries={application.timeline} />
          </div>
        </aside>
      </div>
    </>
  )
}

function Breadcrumbs({ application }: { application: AdoptionApplication }) {
  return (
    <nav className="mb-6 text-body-sm text-on-surface-variant flex items-center gap-2">
      <Link to="/dashboard" className="hover:text-primary">
        Adoptions
      </Link>
      <Icon name="chevron_right" className="text-[16px]" />
      <Link to="/adoptions" className="hover:text-primary">
        Applications
      </Link>
      <Icon name="chevron_right" className="text-[16px]" />
      <span className="text-on-surface">Review Application</span>
      <span className="sr-only">{application.id}</span>
    </nav>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-3">
      {children}
    </p>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

function Timeline({ entries }: { entries: AdoptionTimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-body-sm text-on-surface-variant">
        No timeline entries yet.
      </p>
    )
  }
  return (
    <ol className="relative space-y-5">
      {entries.map((e, i) => (
        <li key={e.id} className="relative pl-7">
          <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15" />
          {i < entries.length - 1 ? (
            <span className="absolute left-[5px] top-5 bottom-[-1.25rem] w-px bg-outline-variant/60" />
          ) : null}
          <p className="text-label-sm text-on-surface-variant">
            {formatDateTime(e.at)}
          </p>
          <p className="text-label-md text-on-surface mt-0.5">{e.title}</p>
          {e.detail ? (
            <p className="text-body-sm text-on-surface-variant mt-1">
              {e.detail}
            </p>
          ) : null}
          <p className="text-body-sm text-on-surface-variant/80 mt-1.5 italic">
            {e.actor}
          </p>
        </li>
      ))}
    </ol>
  )
}
