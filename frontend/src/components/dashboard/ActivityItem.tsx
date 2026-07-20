'use client'

import { Badge } from '@/components/ui/Badge'

interface ActivityItemProps {
  id: string
  title: string
  description?: string
  timestamp: Date
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'default'
  userName?: string
}

export function ActivityItem({
  id,
  title,
  description,
  timestamp,
  type = 'default',
  userName
}: ActivityItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="mt-1">
        <Badge variant={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
          {userName && <span>por {userName}</span>}
          <span>•</span>
          <span>{formatDate(timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
