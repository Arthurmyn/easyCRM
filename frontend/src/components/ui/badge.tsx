import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/30 bg-primary/20 text-primary',
        secondary: 'border-white/10 bg-white/5 text-muted-foreground',
        destructive: 'border-red-500/30 bg-red-500/20 text-red-400',
        success: 'border-green-500/30 bg-green-500/20 text-green-400',
        warning: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400',
        accent: 'border-accent/30 bg-accent/20 text-accent',
        outline: 'border-white/20 bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
