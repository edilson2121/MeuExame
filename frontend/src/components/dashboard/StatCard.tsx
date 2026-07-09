'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  trend?: number;
  href?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'bg-blue-50 dark:bg-blue-900/20',
  trend,
  href 
}: StatCardProps) {
  const content = (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-muted-foreground">vs mês anterior</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-transform hover:scale-105">
        <Card className="p-6">{content}</Card>
      </a>
    );
  }

  return <Card className="p-6">{content}</Card>;
}