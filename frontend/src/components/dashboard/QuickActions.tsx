'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Building2, BookOpen, GraduationCap } from 'lucide-react';

interface QuickAction {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: 'Nova Instituição',
      href: '/institutions/new',
      icon: <Building2 className="w-4 h-4 mr-2" />,
      variant: 'success',
    },
    {
      title: 'Novo Curso',
      href: '/courses/new',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      variant: 'primary',
    },
    {
      title: 'Nova Disciplina',
      href: '/subjects/new',
      icon: <GraduationCap className="w-4 h-4 mr-2" />,
      variant: 'warning',
    },
  ];

  return (
    <Card title="Ações Rápidas" icon={<Plus className="w-5 h-5" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant={action.variant} fullWidth>
              {action.icon} {action.title}
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}