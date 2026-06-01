import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '@repo/auth'
import { Button } from '@repo/ui/components/ui/button'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [submitting, setSubmitting] = React.useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-on-primary font-display font-bold text-lg">
            OP
          </div>
          <div>
            <h1 className="font-display text-headline-md font-bold tracking-tight text-primary leading-none">
              OpenPets
            </h1>
            <p className="text-label-sm text-on-surface-variant mt-1">
              Admin Console
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          disabled={submitting}
          className="w-full"
          onClick={async () => {
            setSubmitting(true)
            await authClient.signIn.social({
              provider: 'google',
              callbackURL: '/',
            })
          }}
        >
          {submitting ? 'Redirecting…' : 'Continue with Google'}
        </Button>
      </div>
    </div>
  )
}
