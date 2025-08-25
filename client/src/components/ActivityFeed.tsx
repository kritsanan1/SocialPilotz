import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  Twitter,
  Linkedin,
  Facebook,
  Calendar,
  Trash2,
  ExternalLink,
  BarChart3,
  Clock,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface SocialPost {
  id: string;
  post: string;
  platforms: string[];
  status: string;
  created: string;
  scheduled?: string;
  analytics?: {
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

const platformIcons: Record<string, React.ComponentType<any>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors: Record<string, string> = {
  twitter: 'text-blue-500',
  linkedin: 'text-blue-600',
  facebook: 'text-blue-700',
  instagram: 'text-pink-500',
  bluesky: 'text-sky-500',
};

export default function ActivityFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchPostHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social/history');
      const result = await response.json();

      if (result.success) {
        setPosts(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load post history');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post from all platforms?')) {
      return;
    }

    try {
      const response = await fetch(`/api/social/post/${postId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        alert(result.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    fetchPostHistory();
  }, []);

  const mockPosts: SocialPost[] = [
    {
      id: '1',
      post: 'Just launched our new AI-powered content planning feature! 🚀 It automatically suggests optimal posting times based on your audience engagement patterns.',
      platforms: ['twitter', 'linkedin'],
      status: 'published',
      created: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      analytics: { likes: 45, shares: 12, comments: 8 }
    },
    {
      id: '2',
      post: 'Behind the scenes: How we built our content calendar with drag-and-drop functionality. The key was using React DnD with a clean, intuitive interface.',
      platforms: ['linkedin'],
      status: 'published',
      created: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      analytics: { likes: 23, shares: 5, comments: 3 }
    },
    {
      id: '3',
      post: 'Exciting announcement coming tomorrow! Stay tuned for something that will revolutionize how you plan and publish content. 👀',
      platforms: ['twitter', 'facebook'],
      status: 'scheduled',
      created: new Date().toISOString(),
      scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'posts', label: 'Posts' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  const activities = [
    {
      id: 1,
      type: 'post',
      title: 'New post published',
      description: 'Your post about AI trends was published to LinkedIn and Twitter',
      timestamp: '2 minutes ago',
      platforms: ['linkedin', 'twitter'],
      status: 'success',
      metrics: { likes: 23, comments: 5, shares: 12 },
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      type: 'engagement',
      title: 'High engagement detected',
      description: 'Your post is performing 150% above average',
      timestamp: '15 minutes ago',
      platforms: ['twitter'],
      status: 'trending',
      metrics: { engagement_rate: '8.5%', reach: 2400 },
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      type: 'scheduled',
      title: 'Post scheduled successfully',
      description: 'Product launch announcement scheduled for tomorrow 2 PM',
      timestamp: '1 hour ago',
      platforms: ['facebook', 'instagram', 'twitter'],
      status: 'scheduled',
      scheduleTime: 'Tomorrow 2:00 PM EST',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      type: 'analytics',
      title: 'Weekly performance report',
      description: 'Your content reached 12.4K people this week (+23%)',
      timestamp: '3 hours ago',
      platforms: ['all'],
      status: 'success',
      metrics: { reach: '12.4K', growth: '+23%', engagement: '6.8%' },
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Content review needed',
      description: 'A scheduled post needs approval before publishing',
      timestamp: '5 hours ago',
      platforms: ['linkedin'],
      status: 'warning',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <Share2 className="w-4 h-4" />;
      case 'engagement': return <TrendingUp className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'trending': return 'text-blue-600 bg-blue-50';
      case 'scheduled': return 'text-orange-600 bg-orange-50';
      case 'warning': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.type === filter);

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-neutral-200 rounded mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Activity Feed</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{activity.title}</h4>
                  {activity.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="text-xs capitalize">
                      {platform}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                {activity.scheduleTime && (
                  <div className="flex items-center gap-2 text-xs text-orange-600 mb-2">
                    <Calendar className="w-3 h-3" />
                    {activity.scheduleTime}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{activity.timestamp}</span>

                  {activity.metrics && (
                    <div className="flex items-center gap-3">
                      {activity.metrics.likes && (
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {activity.metrics.likes}
                        </span>
                      )}
                      {activity.metrics.comments && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {activity.metrics.comments}
                        </span>
                      )}
                      {activity.metrics.shares && (
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {activity.metrics.shares}
                        </span>
                      )}
                      {activity.metrics.engagement_rate && (
                        <span className="text-green-600 font-medium">
                          {activity.metrics.engagement_rate} engagement
                        </span>
                      )}
                      {activity.metrics.reach && (
                        <span className="text-blue-600 font-medium">
                          {activity.metrics.reach} reach
                        </span>
                      )}
                    </div>
                  )}

                  {activity.type === 'analytics' && activity.metrics?.growth && (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>{activity.metrics.growth}</span>
                    </div>
                  )}
                </div>
              </div>

              {activity.type === 'alert' && (
                <Button variant="outline" size="sm">
                  Review
                </Button>
              )}
            </div>
          ))}
        </div>

        {showAnalytics && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Quick Analytics</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-700">12.4K</div>
                <div className="text-blue-600">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-700">6.8%</div>
                <div className="text-blue-600">Avg Engagement</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-700">+23%</div>
                <div className="text-blue-600">Growth</div>
              </div>
            </div>
          </div>
        )}

        <button className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4 py-2">
          View detailed analytics
        </button>
      </CardContent>
    </Card>
  );
}