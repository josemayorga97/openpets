import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApplyHeader } from '../../../components/apply-shell'
import { Icon } from '../../../components/icon'

export const Route = createFileRoute('/_public/apply/success')({
  component: SuccessPage,
})

function SuccessPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ApplyHeader />
      <main className="flex-grow flex flex-col items-center justify-start pt-[120px] pb-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-status-success mb-2">
              <Icon
                name="check_circle"
                fill
                className="text-[32px]"
              />
              <h1 className="text-headline-xl text-on-surface">Thank you!</h1>
            </div>
            <p className="text-body-lg text-on-surface-variant">
              Your application has been submitted.
            </p>
          </section>

          <hr className="border-outline-variant opacity-50" />

          <section className="space-y-8">
            <h2 className="text-headline-md text-on-surface">What's next?</h2>
            <div className="space-y-10 pl-2">
              <NextStep
                number={1}
                accent="primary"
                title="Complete your veterinary form"
              >
                <p className="text-body-md text-on-surface-variant max-w-xl">
                  Fill out this form with your veterinarian and email it to
                  registration@openpets.com.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary/90 transition-colors shadow-sm mt-2"
                >
                  DOWNLOAD VET FORM (PDF)
                  <Icon name="download" className="text-sm" />
                </button>
                <div className="mt-6 bg-surface-container-low text-on-surface p-6 rounded-xl border border-primary-container/20 flex gap-4 items-start shadow-sm">
                  <Icon
                    name="error"
                    fill
                    className="text-primary-container mt-0.5"
                  />
                  <div>
                    <h4 className="text-label-md font-bold mb-1 text-primary-container">
                      Important Note!
                    </h4>
                    <p className="text-body-sm opacity-90">
                      Your application will not be processed until the
                      veterinary form is emailed to{' '}
                      <a
                        className="underline text-primary-container"
                        href="mailto:registration@openpets.com"
                      >
                        registration@openpets.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </NextStep>

              <NextStep number={2} accent="muted" title="When you'll get access">
                <p className="text-body-md text-on-surface-variant max-w-xl">
                  You will receive your application results within 3–5 days
                  after we have both your veterinary form and online
                  application.
                </p>
              </NextStep>
            </div>
          </section>
        </div>
      </main>
      <footer className="bg-surface-container-lowest border-t border-outline-variant fixed bottom-0 w-full z-40 flex justify-between items-center px-4 md:px-container-margin py-4">
        <div className="hidden sm:block text-body-sm text-on-surface-variant">
          Need help? Contact register@openpets.com
        </div>
        <Link
          to="/dashboard"
          onClick={(e) => {
            // Force a navigate so the guard re-evaluates after sign-in.
            e.preventDefault()
            void navigate({ to: '/dashboard' })
          }}
          className="bg-primary text-on-primary rounded-lg px-8 py-3 font-bold hover:bg-primary/90 transition-all shadow-sm"
        >
          GO TO DASHBOARD
        </Link>
      </footer>
    </div>
  )
}

function NextStep({
  number,
  accent,
  title,
  children,
}: {
  number: number
  accent: 'primary' | 'muted'
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-6 items-start">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-headline-md font-bold mt-1 ${
          accent === 'primary'
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {number}
      </div>
      <div className="space-y-2 pt-2">
        <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
        {children}
      </div>
    </div>
  )
}
