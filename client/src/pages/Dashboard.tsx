import Layout from '@/components/Layout';
import StatsOverview from '@/components/StatsOverview';
import PostComposer from '@/components/PostComposer';
import ActivityFeed from '@/components/ActivityFeed';
import AnalyticsPreview from '@/components/AnalyticsPreview';
import CalendarPreview from '@/components/CalendarPreview';
import BulkPostManager from '@/components/BulkPostManager';
import ScheduledPostsList from '@/components/ScheduledPostsList';
import { Plus, PenTool, Calendar, BarChart, Target, Bell } from 'lucide-react';

export default function Dashboard() {
  const quickActions = [
    {
      icon: PenTool,
      title: 'New Content Idea',
      description: 'Capture inspiration',
      color: 'bg-emerald-500',
      action: 'create-idea'
    },
    {
      icon: Plus,
      title: 'Publish Content',
      description: 'Post publication',
      color: 'bg-blue-500',
      action: 'publish-content'
    },
    {
      icon: Calendar,
      title: 'Create Schedule',
      description: 'Start new project',
      color: 'bg-purple-500',
      action: 'create-schedule'
    },
    {
      icon: BarChart,
      title: 'View Analytics',
      description: 'Check performance',
      color: 'bg-orange-500',
      action: 'view-analytics'
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'LinkedIn Article: "AI in Marketing"',
      time: 'Today at 2:00 PM',
      type: 'high',
      platform: 'LinkedIn'
    },
    {
      title: 'Blog Post: Product Update',
      time: 'Tomorrow at 10:00 AM',
      type: 'medium',
      platform: 'Blog'
    },
    {
      title: 'Newsletter: Weekly Insights',
      time: 'Friday at 9:00 AM',
      type: 'low',
      platform: 'Email'
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Good morning, Sarah
          </h1>
          <p className="text-neutral-600">
            Let's make today's content publishing productive and strategic.
          </p>
        </div>

        <StatsOverview />

        {/* Quick Actions and Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-soft transition-all duration-200 text-left group"
                    data-testid={`quick-action-${action.action}`}
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-medium text-neutral-900 text-sm mb-1">
                      {action.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {action.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Upcoming Deadlines</h3>
              <Bell className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  data-testid={`deadline-${index}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    deadline.type === 'high' ? 'bg-red-500' :
                    deadline.type === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 text-sm mb-1">
                      {deadline.title}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {deadline.time} • {deadline.platform}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PostComposer />
          </div>
          <div className="space-y-6">
            <CalendarPreview />
            <AnalyticsPreview />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <BulkPostManager />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <ActivityFeed />
          <ScheduledPostsList />
        </div>
      </div>
    </Layout>
  );
}