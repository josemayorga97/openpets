import { Link } from '@tanstack/react-router'
import { Icon } from './icon'

export type ApplyStepKey =
  | 'about-adoptions'
  | 'about-you'
  | 'about-organization'
  | 'more-details'
  | 'agreement'

export const APPLY_STEPS: ReadonlyArray<{
  key: ApplyStepKey
  label: string
  to: string
}> = [
  { key: 'about-adoptions', label: 'About Adoptions', to: '/apply/about-adoptions' },
  { key: 'about-you', label: 'About You', to: '/apply/about-you' },
  {
    key: 'about-organization',
    label: 'About Organization',
    to: '/apply/about-organization',
  },
  {
    key: 'more-details',
    label: 'More About Organization',
    to: '/apply/more-details',
  },
  { key: 'agreement', label: 'Agreement', to: '/apply/agreement' },
]

export function ApplyStepper({ current }: { current: ApplyStepKey }) {
  const currentIndex = APPLY_STEPS.findIndex((s) => s.key === current)
  return (
    <div className="bg-surface-container-low w-full overflow-x-auto border-b border-outline-variant/30">
      <div className="flex items-stretch justify-start md:justify-center min-w-max md:min-w-0">
        {APPLY_STEPS.map((step, idx) => {
          const isActive = idx === currentIndex
          const isComplete = idx < currentIndex
          const allowNav = isComplete

          const inner = (
            <div className="flex items-center gap-2">
              {isComplete ? (
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
                  <Icon name="check" fill className="text-[16px]" />
                </span>
              ) : (
                <span
                  className={`w-6 h-6 rounded ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant text-on-surface-variant'
                  } flex items-center justify-center text-label-sm font-bold`}
                >
                  {idx + 1}
                </span>
              )}
              <span className="text-label-md whitespace-nowrap">
                {step.label}
              </span>
            </div>
          )

          const containerClass = `flex items-center justify-center px-6 py-3 transition-colors ${
            isActive
              ? 'bg-surface-container-lowest text-primary border-b-4 border-primary font-bold'
              : isComplete
                ? 'text-on-surface-variant hover:bg-surface-container cursor-pointer'
                : 'text-on-surface-variant opacity-70 cursor-not-allowed'
          }`

          if (allowNav) {
            return (
              <Link
                key={step.key}
                to={step.to}
                className={containerClass}
              >
                {inner}
              </Link>
            )
          }
          return (
            <div key={step.key} className={containerClass}>
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}
