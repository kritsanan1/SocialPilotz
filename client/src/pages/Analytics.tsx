import { TrendingUp, Eye, Heart, MessageCircle, Users } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Analytics() {
  const metrics = [
    { label: 'Total Reach', value: '127K', change: '+12.5%', icon: Eye, color: 'text-warm-blue' },
    { label: 'Engagement Rate', value: '8.7%', change: '+2.3%', icon: Heart, color: 'text-muted-rose' },
    { label: 'Total Followers', value: '45.2K', change: '+5.1%', icon: Users, color: 'text-sage' },
    { label: 'Post Interactions', value: '3.8K', change: '+18.7%', icon: MessageCircle, color: 'text-dusty-purple' },
  ];

  const topPerformingPosts = [
    {
      platform: 'LinkedIn',
      content: 'AI-powered content scheduling launch announcement',
      engagement: '15.3%',
      reach: '12.4K',
      color: 'bg-warm-blue'
    },
    {
      platform: 'Twitter',
      content: 'Future of social media management thread',
      engagement: '24.7%',
      reach: '8.9K',
      color: 'bg-black'
    },
    {
      platform: 'Instagram',
      content: 'Behind the scenes development story',
      engagement: '18.2%',
      reach: '6.7K',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Analytics Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600">Track your social media performance and insights</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 shadow-soft border border-neutral-200"
                data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-600">{metric.label}</span>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold text-neutral-900" data-testid={`text-${metric.label.toLowerCase().replace(/\s+/g, '-')}-value`}>
                  {metric.value}
                </div>
                <div className="text-xs text-emerald-500 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Engagement Over Time</h3>
          <div className="h-48 bg-gradient-to-r from-warm-blue/10 to-sage/10 rounded-lg flex items-center justify-center border border-neutral-200">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-500">Interactive chart will be displayed here</p>
              <p className="text-sm text-neutral-400">Connect analytics API for real-time data</p>
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {topPerformingPosts.map((post, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                data-testid={`top-post-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${post.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium">
                      {post.platform.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900 text-sm">{post.content}</div>
                    <div className="text-xs text-neutral-500">{post.platform}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-neutral-900">{post.engagement}</div>
                  <div className="text-xs text-neutral-500">{post.reach} reach</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Platform Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-warm-blue rounded-full" />
                <span className="text-sm font-medium text-neutral-900">LinkedIn</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-warm-blue h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <span className="text-sm text-neutral-600">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-black rounded-full" />
                <span className="text-sm font-medium text-neutral-900">Twitter</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <span className="text-sm text-neutral-600">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                <span className="text-sm font-medium text-neutral-900">Instagram</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <span className="text-sm text-neutral-600">68%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
