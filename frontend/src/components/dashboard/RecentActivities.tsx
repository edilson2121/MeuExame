'use client';

import { Card } from '@/components/ui/Card';
import { ActivityItem } from './ActivityItem';

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type?: 'create' | 'update' | 'delete' | 'login';
}

interface RecentActivitiesProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  { id: '1', action: 'Usuário criou nova instituição', user: 'Admin', time: new Date(Date.now() - 120000).toISOString(), type: 'create' },
  { id: '2', action: 'Curso atualizado: Matemática', user: 'Admin', time: new Date(Date.now() - 900000).toISOString(), type: 'update' },
  { id: '3', action: 'Nova disciplina adicionada', user: 'Admin', time: new Date(Date.now() - 3600000).toISOString(), type: 'create' },
];

export function RecentActivities({ activities = defaultActivities }: RecentActivitiesProps) {
  return (
    <Card title="Atividades Recentes">
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            action={activity.action}
            user={activity.user}
            time={activity.time}
            type={activity.type}
          />
        ))}
      </div>
    </Card>
  );
}