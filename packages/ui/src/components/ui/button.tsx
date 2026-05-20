import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-label text-[12px] font-medium tracking-[0.05em] uppercase transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-container text-on-primary hover:bg-primary-container/90 shadow-sm',
        primary:
          'bg-primary text-on-primary hover:bg-primary-container transition-colors',
        secondary:
          'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm',
        outline:
          'border border-outline-variant text-on-surface hover:bg-surface-container-low',
        ghost: 'text-on-surface-variant hover:bg-surface-container-low',
        link: 'text-primary-container underline-offset-4 hover:underline normal-case tracking-normal',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3',
        lg: 'h-12 px-8 text-[14px]',
        pill: 'h-10 px-6 rounded-full',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
