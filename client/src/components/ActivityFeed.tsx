
import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share, TrendingUp, Calendar, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

interface Activity {
  id: string;
  type: 'post_published' | 'post_scheduled' | 'engagement' | 'analytics' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  platform?: string;
  metrics?: {
    likes?: number;
    shares?: number;
    comments?: number;
  };
  user?: string;
  status?: 'success' | 'warning' | 'error';
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activity');
        const data = await response.json();
        setActivities(data.activities || mockActivities);
      } catch (error) {
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'post_published',
      title: 'Post Published Successfully',
      description: 'Your post about AI trends has been published to LinkedIn and Twitter',
      timestamp: '2025-01-15T14:30:00Z',
      platform: 'linkedin',
      metrics: { likes: 24, shares: 6, comments: 8 },
      status: 'success'
    },
    {
      id: '2',
      type: 'engagement',
      title: 'High Engagement Alert',
      description: 'Your recent post is performing 150% above average',
      timestamp: '2025-01-15T13:15:00Z',
      platform: 'twitter',
      metrics: { likes: 89, shares: 23, comments: 12 },
      status: 'success'
    },
    {
      id: '3',
      type: 'post_scheduled',
      title: 'Post Scheduled',
      description: 'Webinar announcement scheduled for tomorrow at 10:30 AM',
      timestamp: '2025-01-15T11:45:00Z',
      platform: 'facebook',
      status: 'success'
    },
    {
      id: '4',
      type: 'comment',
      title: 'New Comment',
      description: 'Sarah Johnson commented on your LinkedIn post',
      timestamp: '2025-01-15T10:20:00Z',
      platform: 'linkedin',
      user: 'Sarah Johnson',
      status: 'success'
    },
    {
      id: '5',
      type: 'analytics',
      title: 'Weekly Report Ready',
      description: 'Your weekly analytics report is now available',
      timestamp: '2025-01-15T09:00:00Z',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post_published':
        return CheckCircle;
      case 'post_scheduled':
        return Calendar;
      case 'engagement':
        return TrendingUp;
      case 'comment':
        return MessageSquare;
      case 'analytics':
        return TrendingUp;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    if (status === 'error') return 'text-red-600 bg-red-50';
    if (status === 'warning') return 'text-yellow-600 bg-yellow-50';
    
    switch (type) {
      case 'post_published':
        return 'text-green-600 bg-green-50';
      case 'post_scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'engagement':
        return 'text-purple-600 bg-purple-50';
      case 'comment':
        return 'text-orange-600 bg-orange-50';
      case 'analytics':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPlatformBadge = (platform?: string) => {
    const colors: Record<string, string> = {
      linkedin: 'bg-blue-600',
      twitter: 'bg-black',
      facebook: 'bg-blue-500',
      instagram: 'bg-pink-500',
    };

    if (!platform) return null;

    return (
      <div className={`w-4 h-4 ${colors[platform]} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
        {platform[0].toUpperCase()}
      </div>
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Stay updated with your latest social media activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClasses = getActivityColor(activity.type, activity.status);
            
            return (
              <div key={activity.id} className="relative">
                {/* Timeline line */}
                {index < activities.length - 1 && (
                  <div className="absolute left-5 top-12 w-px h-16 bg-slate-200"></div>
                )}
                
                <div className="flex items-start gap-4 pb-6">
                  {/* Icon */}
                  <div className={`w-10 h-10 ${colorClasses} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{activity.title}</h4>
                        {getPlatformBadge(activity.platform)}
                      </div>
                      <span className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                    
                    {/* Metrics */}
                    {activity.metrics && (
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {activity.metrics.likes && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {activity.metrics.likes}
                          </div>
                        )}
                        {activity.metrics.shares && (
                          <div className="flex items-center gap-1">
                            <Share className="w-3 h-3" />
                            {activity.metrics.shares}
                          </div>
                        )}
                        {activity.metrics.comments && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {activity.metrics.comments}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* User mention */}
                    {activity.user && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-6 h-6">
                          <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-xs">
                            {activity.user[0]}
                          </div>
                        </Avatar>
                        <span className="text-xs text-slate-600">{activity.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recent activity</p>
          </div>
        )}
        
        <div className="pt-4 border-t border-slate-200">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
