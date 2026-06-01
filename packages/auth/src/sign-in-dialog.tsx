import * as React from 'react'
import { Button } from '@repo/ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog'
import { signInWithGoogle } from './use-session'

export interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [submitting, setSubmitting] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            Sign in to save favorites and track your applications.
          </DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          variant="primary"
          disabled={submitting}
          className="mt-2 w-full"
          onClick={async () => {
            setSubmitting(true)
            await signInWithGoogle()
          }}
        >
          {submitting ? 'Redirecting…' : 'Continue with Google'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
