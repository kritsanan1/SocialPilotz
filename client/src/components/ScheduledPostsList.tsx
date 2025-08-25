import React, { useState } from 'react';
import { Calendar, Clock, MoreVertical, Edit, Trash2, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: string;
  status: 'scheduled' | 'publishing' | 'failed';
  image?: string;
}

const ScheduledPostsList = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: 'Excited to share our latest product update! 🚀 The new analytics dashboard is now live with real-time insights and improved user experience.',
      platforms: ['linkedin', 'twitter'],
      scheduledTime: '2025-01-16T14:00:00Z',
      status: 'scheduled',
    },
    {
      id: '2',
      content: 'Join us for our upcoming webinar on AI trends in 2025. Register now and get insights from industry experts! #AI #Tech #Innovation',
      platforms: ['linkedin', 'facebook'],
      scheduledTime: '2025-01-17T10:30:00Z',
      status: 'scheduled',
    },
    {
      id: '3',
      content: 'Behind the scenes: How we built our new feature using cutting-edge technology and user feedback. Thread 🧵',
      platforms: ['twitter'],
      scheduledTime: '2025-01-17T16:15:00Z',
      status: 'publishing',
    },
  ]);

  const platformColors: Record<string, string> = {
    linkedin: 'bg-blue-600',
    twitter: 'bg-black',
    facebook: 'bg-blue-500',
    instagram: 'bg-pink-500',
  };

  const platformIcons: Record<string, string> = {
    linkedin: 'L',
    twitter: 'X',
    facebook: 'f',
    instagram: 'I',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'publishing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-lg h-fit">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 truncate">Scheduled Posts</CardTitle>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Your upcoming content</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button self-start sm:self-auto">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(post.status)}>
                  {post.status === 'publishing' && (
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse mr-1" />
                  )}
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(post.scheduledTime)} at {formatTime(post.scheduledTime)}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="w-4 h-4 mr-2" />
                    Post Now
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              {truncateContent(post.content)}
            </p>

            {/* Platforms */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 mr-1">Posting to:</span>
                {post.platforms.map((platform) => (
                  <div
                    key={platform}
                    className={`w-6 h-6 ${platformColors[platform]} rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    {platformIcons[platform]}
                  </div>
                ))}
              </div>
              {post.status === 'scheduled' && (
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No scheduled posts</p>
            <Button variant="outline" size="sm" className="mt-2">
              Schedule Your First Post
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledPostsList;