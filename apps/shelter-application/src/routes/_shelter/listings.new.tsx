import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
import { z } from 'zod'
import {
  ageEnum,
  genderEnum,
  petStatusEnum,
  petTypeEnum,
  sizeEnum,
  type AgeBucket,
  type Gender,
  type PetStatus,
  type PetType,
  type Size,
} from '@repo/domain'
import { useSession } from '@repo/auth'
import { Icon } from '../../components/icon'
import { createPetFn } from '../../lib/server-fns'

export const Route = createFileRoute('/_shelter/listings/new')({
  component: NewListingPage,
})

const schema = z.object({
  name: z.string().trim().min(1, 'Give them a name'),
  type: petTypeEnum,
  breed: z.string().trim().min(1, 'Breed is required'),
  age: ageEnum,
  ageLabel: z.string().trim().min(1, 'e.g. "2 yrs"'),
  gender: genderEnum,
  size: sizeEnum,
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  zip: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .min(40, 'Tell their story — at least 40 characters'),
  photoUrl: z.string().trim().optional(),
  outOfTown: z.boolean(),
  transportAvailable: z.boolean(),
  status: petStatusEnum,
})

type Values = z.infer<typeof schema>

const defaults: Values = {
  name: '',
  type: 'dog',
  breed: '',
  age: 'young',
  ageLabel: '',
  gender: 'female',
  size: 'medium',
  city: '',
  state: '',
  zip: '',
  description: '',
  photoUrl: '',
  outOfTown: false,
  transportAvailable: false,
  status: 'available',
}

const typeOptions: Array<{ value: PetType; label: string; icon: string }> = [
  { value: 'dog', label: 'Dog', icon: 'pets' },
  { value: 'cat', label: 'Cat', icon: 'cruelty_free' },
  { value: 'other', label: 'Other', icon: 'egg_alt' },
]

const ageOptions: Array<{ value: AgeBucket; label: string }> = [
  { value: 'puppy', label: 'Puppy / Kitten' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
]

const sizeOptions: Array<{ value: Size; label: string }> = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xlarge', label: 'XL' },
]

const genderOptions: Array<{ value: Gender; label: string; icon: string }> = [
  { value: 'female', label: 'Female', icon: 'female' },
  { value: 'male', label: 'Male', icon: 'male' },
]

const statusOptions: Array<{
  value: PetStatus
  label: string
  hint: string
  dot: string
}> = [
  {
    value: 'available',
    label: 'Adoptable',
    hint: 'Visible to adopters now',
    dot: 'bg-status-success',
  },
  {
    value: 'medical',
    label: 'Medical Hold',
    hint: 'In care, not yet listed',
    dot: 'bg-status-warning',
  },
  {
    value: 'adopted',
    label: 'Adopted',
    hint: 'Archived to records',
    dot: 'bg-outline',
  },
]

function NewListingPage() {
  const navigate = useNavigate()
  const session = useSession()
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: defaults,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        await createPetFn({
          data: {
            name: value.name.trim(),
            type: value.type,
            breed: value.breed.trim(),
            age: value.age,
            ageLabel: value.ageLabel.trim(),
            gender: value.gender,
            size: value.size,
            location: {
              city: value.city.trim(),
              state: value.state.trim(),
              zip: value.zip?.trim() || undefined,
            },
            photos: value.photoUrl?.trim() ? [value.photoUrl.trim()] : [],
            description: value.description.trim(),
            outOfTown: value.outOfTown,
            transportAvailable: value.transportAvailable,
            shelterId:
              session.status === 'authed'
                ? (session.user as { shelterId?: string })?.shelterId ??
                  'shelter-1'
                : 'shelter-1',
            status: value.status,
          },
        })
        await navigate({ to: '/listings' })
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Could not save listing.',
        )
      }
    },
  })

  const v = useStore(form.store, (s) => s.values as Values)
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  return (
    <div className="relative">
      <BackgroundDecor />

      <header className="relative flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors mb-3"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Back to listings
          </Link>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-label-sm uppercase tracking-[0.18em] text-primary/70">
              New&nbsp;·&nbsp;Composing
            </span>
            <span className="h-px w-10 bg-outline-variant" />
            <span className="text-label-sm text-on-surface-variant">
              Draft #{(Math.random().toString(36).slice(2, 6)).toUpperCase()}
            </span>
          </div>
          <h1 className="font-display text-headline-xl text-on-background mt-2 leading-[1.05] tracking-[-0.02em]">
            A new&nbsp;
            <span className="italic font-light text-primary relative">
              kindred
              <svg
                viewBox="0 0 120 8"
                className="absolute left-0 -bottom-1 w-full h-2 text-primary/40"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 4 Q 30 1, 60 4 T 118 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </span>
            &nbsp;arrives.
          </h1>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start"
      >
        <div className="space-y-6 min-w-0">
          <Section
            num="01"
            title="Identity"
            blurb="The basics that go on the badge."
          >
            <form.Field name="name">
              {(field) => (
                <FieldShell
                  label="Name"
                  required
                  field={field}
                  hint="What this animal answers to (or will)."
                >
                  <input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Bella, Atlas, Whiskey…"
                    className={inputCls}
                  />
                </FieldShell>
              )}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="type">
                {(field) => (
                  <FieldShell label="Species" required field={field}>
                    <SegmentedGroup
                      options={typeOptions}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as PetType)}
                    />
                  </FieldShell>
                )}
              </form.Field>
              <form.Field name="gender">
                {(field) => (
                  <FieldShell label="Gender" required field={field}>
                    <SegmentedGroup
                      options={genderOptions}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as Gender)}
                    />
                  </FieldShell>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="breed">
                {(field) => (
                  <FieldShell label="Breed" required field={field}>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Beagle Mix, Domestic Shorthair…"
                      className={inputCls}
                    />
                  </FieldShell>
                )}
              </form.Field>
              <form.Field name="ageLabel">
                {(field) => (
                  <FieldShell label="Age (display)" required field={field}>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder='e.g. "2 yrs", "8 wks"'
                      className={inputCls}
                    />
                  </FieldShell>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <form.Field name="age">
                {(field) => (
                  <FieldShell label="Life stage" required field={field}>
                    <select
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value as AgeBucket)
                      }
                      onBlur={field.handleBlur}
                      className={selectCls}
                    >
                      {ageOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                )}
              </form.Field>
              <form.Field name="size">
                {(field) => (
                  <FieldShell label="Size" required field={field}>
                    <SegmentedGroup
                      options={sizeOptions}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val as Size)}
                    />
                  </FieldShell>
                )}
              </form.Field>
            </div>
          </Section>

          <Section
            num="02"
            title="Story"
            blurb="The thing that makes someone fall in love at the second sentence."
          >
            <form.Field name="description">
              {(field) => {
                const len = field.state.value.length
                return (
                  <FieldShell label="Description" required field={field}>
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute -top-3 -left-2 text-[64px] leading-none font-display text-primary/15 select-none pointer-events-none"
                      >
                        “
                      </span>
                      <textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={6}
                        placeholder="Tell us about their personality, how they behave around people and other animals, what their ideal home looks like…"
                        className={`${inputCls} h-auto py-4 pl-6 leading-relaxed resize-none`}
                      />
                      <div className="absolute bottom-3 right-4 text-label-sm text-on-surface-variant tabular-nums">
                        {len}/600
                      </div>
                    </div>
                  </FieldShell>
                )
              }}
            </form.Field>
          </Section>

          <Section
            num="03"
            title="Whereabouts"
            blurb="Where they are and how they get to a new home."
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-5">
              <form.Field name="city">
                {(field) => (
                  <FieldShell label="City" required field={field}>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Seattle"
                      className={inputCls}
                    />
                  </FieldShell>
                )}
              </form.Field>
              <form.Field name="state">
                {(field) => (
                  <FieldShell label="State" required field={field}>
                    <input
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(e.target.value.toUpperCase())
                      }
                      onBlur={field.handleBlur}
                      placeholder="WA"
                      maxLength={2}
                      className={`${inputCls} uppercase tracking-widest`}
                    />
                  </FieldShell>
                )}
              </form.Field>
              <form.Field name="zip">
                {(field) => (
                  <FieldShell label="ZIP" field={field}>
                    <input
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="98101"
                      className={inputCls}
                    />
                  </FieldShell>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <form.Field name="outOfTown">
                {(field) => (
                  <ToggleCard
                    icon="travel"
                    title="Out of town"
                    blurb="They're currently fostered outside the metro area."
                    checked={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
              <form.Field name="transportAvailable">
                {(field) => (
                  <ToggleCard
                    icon="local_shipping"
                    title="Transport available"
                    blurb="Volunteers can drive them to a new home."
                    checked={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            </div>
          </Section>

          <Section
            num="04"
            title="Image & status"
            blurb="One hero photo. Choose what happens to the listing on save."
          >
            <form.Field name="photoUrl">
              {(field) => (
                <FieldShell
                  label="Hero photo URL"
                  field={field}
                  hint="Paste a URL or path. Upload coming soon."
                >
                  <div className="relative">
                    <Icon
                      name="image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]"
                    />
                    <input
                      value={field.state.value ?? ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://… or /pet-images/bella.jpg"
                      className={`${inputCls} pl-11`}
                    />
                  </div>
                </FieldShell>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <FieldShell label="Save as" required field={field}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {statusOptions.map((opt) => {
                      const active = field.state.value === opt.value
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => field.handleChange(opt.value)}
                          className={`text-left p-4 rounded-md border transition-all ${
                            active
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-outline-variant hover:border-primary/40 bg-surface-container-lowest'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`w-2 h-2 rounded-full ${opt.dot}`}
                            />
                            <span className="text-label-md text-on-background">
                              {opt.label}
                            </span>
                          </div>
                          <p className="text-label-sm text-on-surface-variant leading-snug">
                            {opt.hint}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </FieldShell>
              )}
            </form.Field>
          </Section>

          {submitError ? (
            <div className="p-4 rounded-md border border-status-alert/30 bg-status-alert/5 text-status-alert text-body-sm flex items-start gap-3">
              <Icon name="error" className="text-[20px] mt-0.5" />
              {submitError}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2 pb-12">
            <Link
              to="/listings"
              className="h-11 px-5 rounded-md border border-outline-variant text-on-surface-variant text-label-md flex items-center gap-2 hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-md bg-primary text-on-primary text-label-md flex items-center gap-2 shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Icon name="progress_activity" className="text-[18px] animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Icon name="auto_awesome" fill className="text-[18px]" />
                  Publish listing
                </>
              )}
            </button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <PreviewCard values={v} />
        </aside>
      </form>
    </div>
  )
}

const inputCls =
  'w-full h-11 rounded-md border border-outline-variant bg-surface-container-lowest px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow'

const selectCls = `${inputCls} appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2370797a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-no-repeat bg-[position:right_12px_center]`

function Section({
  num,
  title,
  blurb,
  children,
}: {
  num: string
  title: string
  blurb: string
  children: React.ReactNode
}) {
  return (
    <section className="relative bg-surface-container-lowest border border-outline-variant rounded-lg p-6 sm:p-8 shadow-[0_2px_12px_-6px_rgba(0,67,77,0.08)]">
      <header className="flex items-baseline gap-4 mb-6 pb-5 border-b border-outline-variant/60">
        <span className="font-display text-headline-md text-primary/30 tabular-nums">
          {num}
        </span>
        <div>
          <h2 className="font-display text-headline-md text-on-background leading-tight">
            {title}
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">{blurb}</p>
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function FieldShell({
  label,
  required,
  field,
  hint,
  children,
}: {
  label: string
  required?: boolean
  field: { state: { meta: { isTouched: boolean; errors: Array<unknown> } } }
  hint?: string
  children: React.ReactNode
}) {
  const meta = field.state.meta
  const hasError = meta.isTouched && meta.errors?.length > 0
  const errMsg = hasError
    ? meta.errors
        .map((e) =>
          typeof e === 'string'
            ? e
            : (e as { message?: string })?.message ?? '',
        )
        .filter(Boolean)
        .join(', ')
    : null
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-label-md text-on-background">
          {label}
          {required ? <span className="text-primary/60 ml-1">*</span> : null}
        </label>
        {hint && !errMsg ? (
          <span className="text-label-sm text-on-surface-variant">{hint}</span>
        ) : null}
      </div>
      {children}
      {errMsg ? (
        <p className="text-label-sm text-status-alert flex items-center gap-1">
          <Icon name="error" className="text-[14px]" />
          {errMsg}
        </p>
      ) : null}
    </div>
  )
}

type SegOption<T extends string> = { value: T; label: string; icon?: string }

function SegmentedGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ReadonlyArray<SegOption<T>>
  value: T
  onChange: (val: T) => void
}) {
  return (
    <div className="flex p-1 rounded-md border border-outline-variant bg-surface-container-low gap-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 h-9 rounded-sm flex items-center justify-center gap-1.5 text-label-md transition-all ${
              active
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {opt.icon ? (
              <Icon name={opt.icon} className="text-[16px]" />
            ) : null}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function ToggleCard({
  icon,
  title,
  blurb,
  checked,
  onChange,
}: {
  icon: string
  title: string
  blurb: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`text-left p-4 rounded-md border flex gap-3 items-start transition-all ${
        checked
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
      }`}
    >
      <span
        className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
          checked
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        <Icon name={icon} className="text-[18px]" fill={checked} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-label-md text-on-background">{title}</span>
          <span
            className={`w-9 h-5 rounded-full relative transition-colors ${
              checked ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                checked ? 'left-[18px]' : 'left-0.5'
              }`}
            />
          </span>
        </div>
        <p className="text-label-sm text-on-surface-variant mt-1 leading-snug">
          {blurb}
        </p>
      </div>
    </button>
  )
}

function PreviewCard({ values }: { values: Values }) {
  const status = statusOptions.find((s) => s.value === values.status) ?? statusOptions[0]
  const typeMeta = typeOptions.find((t) => t.value === values.type)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
        <span className="h-px w-6 bg-outline" />
        Live preview
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-[0_24px_48px_-24px_rgba(0,67,77,0.25)]">
        <div className="h-56 w-full relative overflow-hidden bg-gradient-to-br from-primary/10 via-surface-variant to-secondary/10 flex items-center justify-center">
          {values.photoUrl ? (
            <img
              src={values.photoUrl}
              alt={values.name || 'Pet preview'}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-on-surface-variant/60">
              <Icon name={typeMeta?.icon ?? 'pets'} className="text-[56px]" />
              <span className="text-label-sm">Photo will appear here</span>
            </div>
          )}
          <div
            className={`absolute top-3 left-3 px-3 py-1 bg-surface-container-lowest/95 backdrop-blur-sm rounded-full border border-outline-variant flex items-center gap-1.5`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className="text-label-sm text-on-background">
              {status.label}
            </span>
          </div>
          {values.transportAvailable ? (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary/90 text-on-primary rounded-full text-label-sm flex items-center gap-1">
              <Icon name="local_shipping" className="text-[14px]" />
              Transport
            </div>
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="font-display text-headline-md text-on-background truncate">
              {values.name || 'Unnamed'}
            </h3>
            <span className="text-label-sm text-on-surface-variant tabular-nums shrink-0">
              {values.ageLabel || '—'}
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant capitalize">
            {[values.type, values.breed, values.gender]
              .filter(Boolean)
              .join(' · ') || 'No details yet'}
          </p>
          <div className="mt-4 pt-4 border-t border-surface-muted flex items-center justify-between text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="location_on" className="text-[14px]" />
              {values.city
                ? `${values.city}${values.state ? ', ' + values.state : ''}`
                : 'Location'}
            </span>
            <span className="capitalize">{values.size}</span>
          </div>
          {values.description ? (
            <p className="mt-4 text-body-sm text-on-surface leading-relaxed line-clamp-4 italic">
              “{values.description}”
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-label-sm text-on-surface-variant px-1 leading-snug">
        This is roughly how the listing appears on adopter-facing pages.
      </p>
    </div>
  )
}

function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 -top-24 h-72 pointer-events-none -z-10 overflow-hidden"
    >
      <div className="absolute -top-24 -right-32 w-[420px] h-[420px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-12 -left-24 w-[320px] h-[320px] rounded-full bg-secondary/10 blur-3xl" />
    </div>
  )
}
