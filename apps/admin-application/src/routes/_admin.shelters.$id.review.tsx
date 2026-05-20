import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import {
  Ban,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Stethoscope,
  PawPrint,
  Building2,
} from 'lucide-react'
import { fetchShelter } from '#/lib/server-fns'

export const Route = createFileRoute('/_admin/shelters/$id/review')({
  loader: async ({ params }) => {
    const shelter = await fetchShelter({ data: { id: params.id } })
    if (!shelter) throw notFound()
    return { shelter }
  },
  component: ShelterReviewPage,
})

function ShelterReviewPage() {
  const { shelter } = Route.useLoaderData()

  return (
    <div className="pb-32">
      <Breadcrumbs name={shelter.name} />

      <h1 className="font-display text-headline-lg text-on-surface mt-1">
        Review Shelter Application
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 mb-section-gap">
        Verify documentation and operational readiness for {shelter.name}.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl border border-border-light shadow-soft p-card-inner-padding overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
            <div className="flex justify-between items-start mb-6 relative">
              <div>
                <h2 className="font-display text-headline-md font-semibold text-on-surface mb-1">
                  Organization Overview
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Submitted on {shelter.appliedAt}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-label-sm">
                <ClipboardList className="size-4" />
                Pending Review
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Field label="Legal Name" value={`${shelter.name}, Inc.`} />
              <Field label="Tax ID / EIN" value="12-3456789" mono />
              <Field
                label="Primary Contact"
                icon={<User className="size-4" />}
                value={`${shelter.contact}, Director`}
              />
              <div className="flex flex-col gap-1">
                <span className="text-label-sm text-on-surface-variant">
                  Contact Info
                </span>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-on-surface-variant" />
                  <a
                    className="text-body-md text-primary hover:underline"
                    href="mailto:contact@example.org"
                  >
                    contact@{shelter.id}.org
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-on-surface-variant" />
                  <span className="text-body-md text-on-surface font-medium">
                    (555) 123-4567
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-border-light pt-6">
              <h3 className="text-label-md text-on-surface mb-3 uppercase tracking-wide">
                Mission Statement
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Our mission is to provide a safe, loving, and temporary home
                for abandoned, abused, and neglected animals. We rehabilitate
                them medically and behaviorally, and ultimately match them with
                responsible, permanent adoptive families.
              </p>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl border border-border-light shadow-soft p-card-inner-padding">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <Building2 className="size-5" />
              </div>
              <h2 className="font-display text-headline-md font-semibold text-on-surface">
                Facilities & Capacity
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CapacityStat icon={<PawPrint className="size-6" />} value="45" label="Max Dogs" />
              <CapacityStat icon={<PawPrint className="size-6" />} value="60" label="Max Cats" />
              <CapacityStat
                icon={<Stethoscope className="size-6" />}
                value="Yes"
                label="On-site Clinic"
              />
              <CapacityStat icon={<Users className="size-6" />} value="12" label="Staff/Vols" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-xl border border-border-light shadow-soft p-card-inner-padding">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <FolderOpen className="size-5" />
              </div>
              <h2 className="font-display text-headline-md font-semibold text-on-surface">
                Legal Documents
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <DocItem
                icon={<FileText className="size-5 text-error" />}
                title="501(c)(3) Determination"
                meta="2.4 MB • Verified"
              />
              <DocItem
                icon={<FileText className="size-5 text-error" />}
                title="State Operating License"
                meta="1.1 MB • Verified"
              />
              <DocItem
                icon={<ImageIcon className="size-5 text-primary" />}
                title="Facility Blueprint"
                meta="5.6 MB"
              />
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl border border-border-light shadow-soft p-card-inner-padding">
            <h2 className="font-display text-headline-md font-semibold text-on-surface mb-4">
              Location
            </h2>
            <div className="rounded-lg overflow-hidden border border-border-light mb-4 h-48 bg-surface-container-low flex items-center justify-center">
              <div className="text-center">
                <MapPin className="size-8 text-outline mx-auto mb-2" />
                <p className="text-label-sm text-on-surface-variant">
                  Map View of {shelter.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-on-surface-variant mt-0.5" />
              <div>
                <p className="text-body-md text-on-surface font-medium">
                  1234 Rescue Road
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  {shelter.location}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ActionBar />
    </div>
  )
}

function Breadcrumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-label-sm text-on-surface-variant">
        <li>
          <Link to="/shelters" className="hover:text-primary transition-colors">
            Shelters
          </Link>
        </li>
        <li>
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="text-primary font-medium">
          {name}
        </li>
      </ol>
    </nav>
  )
}

function Field({
  label,
  value,
  mono,
  icon,
}: {
  label: string
  value: string
  mono?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-sm text-on-surface-variant">{label}</span>
      <div className="flex items-center gap-2">
        {icon && <span className="text-on-surface-variant">{icon}</span>}
        <span
          className={
            mono
              ? 'text-body-md text-on-surface font-medium font-mono'
              : 'text-body-md text-on-surface font-medium'
          }
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function CapacityStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center">
      <span className="text-on-surface-variant mb-2">{icon}</span>
      <span className="font-display text-headline-md text-primary">{value}</span>
      <span className="text-label-sm text-on-surface-variant uppercase mt-1">
        {label}
      </span>
    </div>
  )
}

function DocItem({
  icon,
  title,
  meta,
}: {
  icon: React.ReactNode
  title: string
  meta: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border-light hover:bg-surface-container-low transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-label-md text-on-surface">{title}</p>
          <p className="text-label-sm text-on-surface-variant">{meta}</p>
        </div>
      </div>
      <Download className="size-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

function ActionBar() {
  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface-container-lowest border-t border-border-light shadow-[0_-4px_24px_rgba(0,0,0,0.05)] p-4 md:px-margin-desktop z-30 flex items-center justify-between">
      <div className="hidden sm:block">
        <p className="text-label-sm text-on-surface-variant">
          Reviewing as <span className="font-semibold text-on-surface">Admin User</span>
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button
          type="button"
          className="h-11 px-6 rounded-lg border-2 border-primary text-primary text-label-md hover:bg-primary-fixed/30 transition-colors flex items-center gap-2"
        >
          <Ban className="size-4" />
          Reject Application
        </button>
        <button
          type="button"
          className="h-11 px-6 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container shadow-sm transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="size-4" />
          Approve Shelter
        </button>
      </div>
    </div>
  )
}
