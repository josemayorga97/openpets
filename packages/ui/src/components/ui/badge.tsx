import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-1 font-label text-[12px] font-medium tracking-[0.05em]',
  {
    variants: {
      variant: {
        default: 'bg-surface-container text-on-surface-variant',
        primary: 'bg-primary text-on-primary uppercase',
        outline: 'border border-outline-variant text-on-surface-variant',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
