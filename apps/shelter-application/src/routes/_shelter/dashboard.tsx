import { createFileRoute } from '@tanstack/react-router'
import { Icon } from '../../components/icon'

export const Route = createFileRoute('/_shelter/dashboard')({
  component: DashboardPage,
})

const statusCards = [
  { value: '98', label: 'Adoptable Pets Posted' },
  { value: '6', label: 'Adoptions Pending' },
  { value: '127', label: 'Pets On Hold' },
  { value: '78', label: 'Pets Adopted' },
  { value: '635', label: 'Drafts' },
]

const weekStats = [
  { value: '21', label: 'Listings Added' },
  { value: '840', label: 'Member Page Views' },
  { value: '145', label: 'Pet Views' },
  { value: '12', label: 'Pet Inquiries' },
  { value: '8', label: 'Pets Adopted' },
]

const activity = [
  {
    icon: 'edit',
    bg: 'bg-surface-container',
    color: 'text-primary',
    body: (
      <>
        <span className="font-semibold text-primary">Sarah J.</span> updated
        medical records for <span className="font-semibold">Hoover</span>.
      </>
    ),
    time: '10 mins ago',
  },
  {
    icon: 'assignment_ind',
    bg: 'bg-secondary-fixed',
    color: 'text-on-secondary-container',
    body: (
      <>
        New foster application received for{' '}
        <span className="font-semibold">Bella</span>.
      </>
    ),
    time: '45 mins ago',
  },
  {
    icon: 'check_circle',
    bg: 'bg-status-success/20',
    color: 'text-status-success',
    body: (
      <>
        <span className="font-semibold text-primary">Max</span> has been marked
        as Adopted!
      </>
    ),
    time: '2 hours ago',
  },
  {
    icon: 'publish',
    bg: 'bg-primary-container/20',
    color: 'text-primary',
    body: <>3 new pet listings published to web.</>,
    time: '4 hours ago',
  },
]

function DashboardPage() {
  return (
    <>
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">
            Dashboard
          </p>
          <h2 className="text-headline-xl text-primary">
            Good morning, Hope Shelter
          </h2>
        </div>
        <div className="text-right">
          <p className="text-body-md text-on-surface-variant">Today is</p>
          <p className="text-headline-md text-text-main">May 20, 2026</p>
        </div>
      </div>

      <section className="mb-12">
        <h3 className="text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">
          Current Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-card-gap">
          {statusCards.map((c) => (
            <div
              key={c.label}
              className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant/30 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-200"
            >
              <span className="text-headline-xl text-text-main mb-1">
                {c.value}
              </span>
              <span className="text-body-sm text-on-surface-variant">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-widest">
              <Icon name="info" className="text-[18px]" />
              Announcements
            </h3>
          </div>
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row h-full">
            <div className="bg-tertiary-fixed w-full md:w-1/2 min-h-[200px] relative p-6 flex items-center justify-center">
              <div className="bg-surface-container-lowest rounded-md shadow-lg p-4 w-48 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <div className="w-full h-24 bg-surface-muted rounded mb-3" />
                <div className="h-4 bg-surface-container w-3/4 rounded mb-2" />
                <div className="h-3 bg-surface-container w-1/2 rounded" />
              </div>
              <div className="absolute bottom-6 right-6 bg-surface-container-lowest px-4 py-2 rounded-full shadow-md text-label-md flex items-center gap-2">
                Create Kennel Cards
                <Icon
                  name="touch_app"
                  className="text-primary-container text-[16px]"
                />
              </div>
            </div>
            <div className="p-8 w-full md:w-1/2 flex flex-col justify-center">
              <h4 className="text-headline-md text-primary mb-2">
                Create Kennel Cards
              </h4>
              <p className="text-body-md text-on-surface-variant mb-6">
                You can now create highly customized, printable kennel cards
                directly from your active pet listings with just one click.
              </p>
              <div>
                <button
                  type="button"
                  className="bg-tertiary text-on-tertiary text-label-md px-6 py-3 rounded-md hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors"
                >
                  Try it out
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1">
          <h3 className="text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">
            Recent Activity
          </h3>
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6 h-full">
            <ul className="space-y-6">
              {activity.map((a, i) => (
                <li key={i} className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full ${a.bg} flex items-center justify-center ${a.color} mt-1 shrink-0`}
                  >
                    <Icon name={a.icon} className="text-[16px]" />
                  </div>
                  <div>
                    <p className="text-body-sm text-text-main">{a.body}</p>
                    <p className="text-label-sm text-outline mt-1">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
              <a
                href="#"
                className="text-label-md text-primary hover:underline"
              >
                View all activity
              </a>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest">
              The Week's Stats
            </h3>
            <p className="text-label-sm text-outline mt-1">May 13 - May 20</p>
          </div>
          <a href="#" className="text-label-md text-tertiary hover:underline">
            Go to statistics Page
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-card-gap">
          {weekStats.map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-lowest rounded-lg p-5 border border-outline-variant/30 flex flex-col items-center justify-center text-center"
            >
              <span className="text-headline-lg text-text-main mb-1">
                {s.value}
              </span>
              <span className="text-body-sm text-on-surface-variant">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
