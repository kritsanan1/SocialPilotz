import { TrendingUp, Heart } from 'lucide-react';
import type { StatCard } from '@/types';

export default function StatsOverview() {
  const stats: StatCard[] = [
    {
      label: 'Total Reach',
      value: '127K',
      change: '+12.5%',
      icon: 'trending-up',
      color: 'text-emerald-500'
    },
    {
      label: 'Engagement',
      value: '8.7%',
      change: '+2.3%',
      icon: 'heart',
      color: 'text-muted-rose'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-4 shadow-soft border border-neutral-200"
          data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">{stat.label}</span>
            {stat.icon === 'trending-up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <Heart className="w-4 h-4 text-muted-rose" />
            )}
          </div>
          <div className="text-2xl font-bold text-neutral-900" data-testid={`text-${stat.label.toLowerCase().replace(' ', '-')}-value`}>
            {stat.value}
          </div>
          <div className="text-xs text-emerald-500 font-medium" data-testid={`text-${stat.label.toLowerCase().replace(' ', '-')}-change`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
