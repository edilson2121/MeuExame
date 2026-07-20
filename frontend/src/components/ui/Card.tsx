'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  icon?: ReactNode
  hover?: boolean
  headerAction?: ReactNode
}

export function Card({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon, 
  hover = true,
  headerAction 
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover',
        className
      )}
    >
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}