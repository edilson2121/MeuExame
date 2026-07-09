'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface StatusItem {
  label: string;
  value: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
}

export function SystemStatus() {
  const status: StatusItem[] = [
    { label: 'Versão', value: '2.0.0', variant: 'primary' },
    { label: 'Ambiente', value: 'Produção', variant: 'success' },
    { label: 'Status', value: 'Online', variant: 'success' },
    { label: 'Banco de Dados', value: 'Conectado', variant: 'success' },
  ];

  return (
    <Card title="Resumo do Sistema">
      <div className="space-y-3">
        {status.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <Badge variant={item.variant}>{item.value}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}