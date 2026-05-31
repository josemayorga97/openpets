import * as React from 'react'
import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import type { ApplicationStatusType } from '@repo/data-utils/zod-schema/applications'
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

type Application = NonNullable<Awaited<ReturnType<typeof getApplicationFn>>>

const currentStatusStyle: Record<
  ApplicationStatusType,
  { iconBg: string; icon: string; iconColor: string; label: string }
> = {
  submitted: {
    iconBg: 'bg-status-warning/15',
    iconColor: 'text-status-warning',
    icon: 'pending_actions',
    label: 'Submitted',
  },
  under_review: {
    iconBg: 'bg-status-warning/15',
    iconColor: 'text-status-warning',
    icon: 'pending_actions',
    label: 'Under Review',
  },
  approved: {
    iconBg: 'bg-status-success/15',
    iconColor: 'text-status-success',
    icon: 'check_circle',
    label: 'Approved',
  },
  finalized: {
    iconBg: 'bg-status-success/15',
    iconColor: 'text-status-success',
    icon: 'task_alt',
    label: 'Finalized',
  },
  rejected: {
    iconBg: 'bg-status-alert/15',
    iconColor: 'text-status-alert',
    icon: 'cancel',
    label: 'Rejected',
  },
  withdrawn: {
    iconBg: 'bg-outline-variant/30',
    iconColor: 'text-on-surface-variant',
    icon: 'undo',
    label: 'Withdrawn',
  },
  superseded: {
    iconBg: 'bg-outline-variant/30',
    iconColor: 'text-on-surface-variant',
    icon: 'history',
    label: 'Superseded',
  },
}

// The transitions a reviewer can apply from this screen.
const statusChoices: Array<{
  value: ApplicationStatusType
  title: string
  hint: string
  icon: string
  iconColor: string
}> = [
  {
    value: 'under_review',
    title: 'Mark Under Review',
    hint: 'Application is being evaluated.',
    icon: 'pending_actions',
    iconColor: 'text-status-warning',
  },
  {
    value: 'approved',
    title: 'Approve Adoption',
    hint: 'Applicant meets all requirements.',
    icon: 'check_circle',
    iconColor: 'text-status-success',
  },
  {
    value: 'finalized',
    title: 'Finalize',
    hint: 'Adoption is complete.',
    icon: 'task_alt',
    iconColor: 'text-status-success',
  },
  {
    value: 'rejected',
    title: 'Reject',
    hint: 'Applicant does not meet criteria.',
    icon: 'cancel',
    iconColor: 'text-status-alert',
  },
]

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
  const [selected, setSelected] = React.useState<ApplicationStatusType>(
    application.status,
  )
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
          Application{' '}
          <span className="font-mono font-semibold text-on-surface">
            #{application.id}
          </span>{' '}
          — applicant{' '}
          <span className="font-mono font-semibold text-on-surface">
            {application.applicantId}
          </span>{' '}
          for pet{' '}
          <span className="font-mono font-semibold text-on-surface">
            {application.petId}
          </span>
          .
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
                {application.notes ? (
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {application.notes}
                  </p>
                ) : null}
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
              disabled={saving || selected === application.status}
              className="h-11 px-5 rounded-md bg-primary text-on-primary text-label-md hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Confirm Status Change'}
            </button>
          </div>
        </div>

        <aside className="space-y-3">
          <SectionLabel>Details</SectionLabel>
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 space-y-3">
            <DetailRow label="Application ID" value={application.id} mono />
            <DetailRow label="Pet ID" value={application.petId} mono />
            <DetailRow label="Applicant ID" value={application.applicantId} mono />
            <DetailRow
              label="Submitted"
              value={formatShortDate(application.submittedAt)}
            />
            {application.decidedAt ? (
              <DetailRow
                label="Decided"
                value={formatShortDate(application.decidedAt)}
              />
            ) : null}
            {application.finalizedAt ? (
              <DetailRow
                label="Finalized"
                value={formatShortDate(application.finalizedAt)}
              />
            ) : null}
          </div>
        </aside>
      </div>
    </>
  )
}

function Breadcrumbs({ application }: { application: Application }) {
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

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <span
        className={`text-body-sm text-on-surface ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
