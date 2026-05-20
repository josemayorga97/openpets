import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Icon } from './icon'
import { ApplyStepper, APPLY_STEPS, type ApplyStepKey } from './apply-stepper'
import { clearApplicationDraft } from '../lib/application-form'

export function ApplyHeader({ current }: { current?: ApplyStepKey }) {
  return (
    <header className="bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant fixed top-0 w-full z-40">
      <div className="flex justify-between items-center w-full px-4 md:px-container-margin py-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-headline-md font-extrabold text-primary"
          >
            <Icon name="pets" fill />
            <span>OpenPets</span>
          </Link>
          <div className="h-6 w-px bg-outline-variant hidden md:block" />
          <h1 className="text-on-surface text-body-md font-medium hidden md:block">
            New Organization Application
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
            O
          </div>
        </div>
      </div>
      {current ? <ApplyStepper current={current} /> : null}
    </header>
  )
}

export function ApplyFooter({
  current,
  canSubmit,
  onSubmit,
  submitting,
  prevLabel = 'PREV',
  nextLabel,
}: {
  current: ApplyStepKey
  canSubmit?: boolean
  onSubmit?: () => void | Promise<void>
  submitting?: boolean
  prevLabel?: string
  nextLabel?: string
}) {
  const navigate = useNavigate()
  const idx = APPLY_STEPS.findIndex((s) => s.key === current)
  const prev = idx > 0 ? APPLY_STEPS[idx - 1] : null
  const next = idx < APPLY_STEPS.length - 1 ? APPLY_STEPS[idx + 1] : null
  const isLast = !next

  const onCancel = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        'Cancel the application? Your in-progress answers will be discarded.',
      )
    )
      return
    clearApplicationDraft()
    void navigate({ to: '/' })
  }

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant fixed bottom-0 w-full z-40 flex justify-between items-center px-4 md:px-container-margin py-4 gap-4">
      <div className="text-body-sm text-on-surface-variant hidden md:block">
        Need help? Contact{' '}
        <a
          href="mailto:register@openpets.com"
          className="text-primary font-bold hover:underline"
        >
          register@openpets.com
        </a>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button
          type="button"
          onClick={onCancel}
          className="text-error hover:bg-error-container/30 rounded-lg px-3 py-2 transition-colors flex items-center gap-2 text-label-md font-bold"
        >
          <Icon name="delete" className="text-[20px]" />
          <span className="hidden md:inline">CANCEL APPLICATION</span>
        </button>
        {prev ? (
          <Link
            to={prev.to}
            className="bg-surface-container-lowest border border-outline text-on-surface-variant hover:bg-surface-container rounded-lg px-6 py-2 transition-colors flex items-center gap-2 text-label-md font-bold min-h-[44px]"
          >
            <Icon name="arrow_back" className="text-[20px]" />
            {prevLabel}
          </Link>
        ) : null}
        {isLast ? (
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => void onSubmit?.()}
            className={`rounded-lg px-8 py-2 text-label-md font-bold min-h-[44px] flex items-center gap-2 transition-all ${
              canSubmit && !submitting
                ? 'bg-primary text-on-primary hover:bg-primary/90'
                : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {submitting ? 'SUBMITTING…' : 'SUBMIT'}
          </button>
        ) : next ? (
          <NextButton next={next} onSubmit={onSubmit} label={nextLabel} />
        ) : null}
      </div>
    </footer>
  )
}

function NextButton({
  next,
  onSubmit,
  label,
}: {
  next: { to: string }
  onSubmit?: () => void | Promise<void>
  label?: string
}) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={async () => {
        if (onSubmit) {
          await onSubmit()
        }
        await navigate({ to: next.to })
      }}
      className="bg-primary text-on-primary rounded-lg px-6 py-2 text-label-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-all min-h-[44px]"
    >
      {label ?? 'NEXT'}
      <Icon name="arrow_forward" className="text-[20px]" />
    </button>
  )
}

export function ApplyMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-container-margin py-8 pt-[136px] pb-[88px]">
      <p className="text-body-sm text-on-surface-variant mb-6">
        Field marked with asterisk (<span className="text-error">*</span>) are
        required
      </p>
      {children}
    </main>
  )
}
