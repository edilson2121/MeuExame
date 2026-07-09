'use client';

import { Card } from '@/components/ui/Card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  height?: number;
}

export function ChartCard({ title, children, height = 300 }: ChartCardProps) {
  return (
    <Card title={title}>
      <div style={{ height }}>
        {children}
      </div>
    </Card>
  );
}