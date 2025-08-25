import { TrendingUp, Heart, Users, MessageCircle } from 'lucide-react';
import type { StatCard } from '@/types';

export default function StatsOverview() {
  const stats: StatCard[] = [
    {
      label: 'Content Planned',
      value: '23',
      change: '+12%',
      icon: 'trending-up',
      color: 'text-blue-500'
    },
    {
      label: 'Total Content',
      value: '47',
      change: '+8%',
      icon: 'message-circle',
      color: 'text-emerald-500'
    },
    {
      label: 'Goal Progress',
      value: '89%',
      change: '+15%',
      icon: 'trending-up',
      color: 'text-orange-500'
    },
    {
      label: 'Engagement',
      value: '+12%',
      change: 'vs last month',
      icon: 'heart',
      color: 'text-muted-rose'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'trending-up':
        return TrendingUp;
      case 'heart':
        return Heart;
      case 'users':
        return Users;
      case 'message-circle':
        return MessageCircle;
      default:
        return TrendingUp;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => {
        const Icon = getIcon(stat.icon);
        return (
          <div 
            key={index}
            className="bg-white rounded-xl p-4 shadow-soft border border-neutral-200 hover:shadow-medium transition-shadow"
            data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-neutral-600">{stat.label}</span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1" data-testid={`text-${stat.label.toLowerCase().replace(/\s+/g, '-')}-value`}>
              {stat.value}
            </div>
            <div className="text-xs text-neutral-500 font-medium" data-testid={`text-${stat.label.toLowerCase().replace(/\s+/g, '-')}-change`}>
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
