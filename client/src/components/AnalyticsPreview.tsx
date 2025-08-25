import React from 'react';
import { TrendingUp, Users, MessageSquare, Heart, Share, Eye, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

const AnalyticsPreview = () => {
  const metrics = [
    {
      title: 'Total Reach',
      value: '12.4K',
      change: '+23%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      label: 'Reach'
    },
    {
      title: 'Engagement',
      value: '2.8K',
      change: '+18%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Engagement'
    },
    {
      title: 'Comments',
      value: '456',
      change: '+12%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Comments'
    },
    {
      title: 'Shares',
      value: '234',
      change: '+8%',
      trend: 'up',
      icon: Share,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      label: 'Shares'
    },
  ];

  const platformPerformance = [
    { name: 'LinkedIn', engagement: 85, color: 'bg-blue-500', posts: 24 },
    { name: 'Twitter', engagement: 72, color: 'bg-black', posts: 18 },
    { name: 'Facebook', engagement: 68, color: 'bg-blue-400', posts: 12 },
    { name: 'Instagram', engagement: 45, color: 'bg-pink-500', posts: 8 },
  ];

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 truncate">Analytics Overview</CardTitle>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Your content performance</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button self-start sm:self-auto">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="relative p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Badge variant="outline" className={`${
                  metric.trend === 'up' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'
                }`}>
                  {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
                <p className="text-sm text-slate-600">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Performance */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900 text-lg">Platform Performance</h3>
          <div className="space-y-4">
            {platformPerformance.map((platform, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${platform.color} rounded-full`} />
                    <span className="font-medium text-slate-900">{platform.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {platform.posts} posts
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {platform.engagement}%
                  </span>
                </div>
                <Progress value={platform.engagement} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Quick Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-700">LinkedIn posts perform 23% better on weekdays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-slate-700">Best posting time: 2:00 PM EST</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-slate-700">Video content gets 40% more engagement</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPreview;