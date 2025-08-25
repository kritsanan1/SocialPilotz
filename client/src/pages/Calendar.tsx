
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  MoreHorizontal,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: scheduledPosts, isLoading } = useQuery({
    queryKey: ['posts', 'scheduled'],
    queryFn: async () => {
      const response = await fetch('/api/posts/scheduled');
      return response.json();
    }
  });

  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, scheduleDate }: { id: string; scheduleDate: string }) => {
      const response = await fetch(`/api/posts/${id}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleDate })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'scheduled'] });
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'scheduled'] });
      setIsCreateDialogOpen(false);
    }
  });

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' }
  ];

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || 'bg-gray-500';
  };

  const getPostsForDate = (date: Date) => {
    if (!scheduledPosts?.data?.posts) return [];
    
    return scheduledPosts.data.posts.filter((post: any) => {
      const postDate = new Date(post.scheduleDate);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const filteredPosts = scheduledPosts?.data?.posts?.filter((post: any) => {
    const matchesPlatform = filterPlatform === 'all' || post.platforms.includes(filterPlatform);
    const matchesSearch = searchQuery === '' || post.post.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  }) || [];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const getDayView = () => {
    const dayPosts = getPostsForDate(selectedDate);
    const timeSlots = generateTimeSlots();

    return (
      <div className="space-y-2">
        {timeSlots.map(time => {
          const postsAtTime = dayPosts.filter((post: any) => {
            const postTime = new Date(post.scheduleDate);
            const slotTime = `${postTime.getHours()}:${postTime.getMinutes().toString().padStart(2, '0')}`;
            return slotTime === time;
          });

          return (
            <div key={time} className="flex items-start gap-4 p-2 border-b border-gray-100">
              <div className="w-16 text-sm text-muted-foreground font-medium">{time}</div>
              <div className="flex-1 space-y-2">
                {postsAtTime.length > 0 ? (
                  postsAtTime.map((post: any) => (
                    <PostCard key={post.id} post={post} onReschedule={rescheduleMutation.mutate} />
                  ))
                ) : (
                  <div className="h-8 border-dashed border-2 border-gray-200 rounded flex items-center justify-center text-xs text-muted-foreground">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day.toISOString()} className="space-y-2">
            <h3 className="font-medium text-center p-2 bg-muted rounded">
              {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </h3>
            <div className="space-y-1 min-h-32">
              {getPostsForDate(day).map((post: any) => (
                <PostCard key={post.id} post={post} compact onReschedule={rescheduleMutation.mutate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your social media posts</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <CreatePostForm 
                onSubmit={(data) => createPostMutation.mutate(data)}
                selectedDate={selectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(platform => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (viewMode === 'day') {
                newDate.setDate(selectedDate.getDate() - 1);
              } else if (viewMode === 'week') {
                newDate.setDate(selectedDate.getDate() - 7);
              } else {
                newDate.setMonth(selectedDate.getMonth() - 1);
              }
              setSelectedDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold">
            {viewMode === 'day' 
              ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              : viewMode === 'week'
              ? `Week of ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            }
          </h2>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (viewMode === 'day') {
                newDate.setDate(selectedDate.getDate() + 1);
              } else if (viewMode === 'week') {
                newDate.setDate(selectedDate.getDate() + 7);
              } else {
                newDate.setMonth(selectedDate.getMonth() + 1);
              }
              setSelectedDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
          Today
        </Button>
      </div>

      {/* Calendar Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mini Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            
            {/* Quick Stats */}
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Posts today:</span> {getPostsForDate(new Date()).length}
              </div>
              <div className="text-sm">
                <span className="font-medium">This week:</span> {/* Calculate week posts */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Calendar View */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            {viewMode === 'day' && getDayView()}
            {viewMode === 'week' && getWeekView()}
            {viewMode === 'month' && (
              <div className="space-y-4">
                {filteredPosts.map((post: any) => (
                  <PostCard key={post.id} post={post} onReschedule={rescheduleMutation.mutate} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PostCard = ({ post, compact = false, onReschedule }: { 
  post: any; 
  compact?: boolean; 
  onReschedule: (data: { id: string; scheduleDate: string }) => void; 
}) => {
  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' }
  ];

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData?.color || 'bg-gray-500';
  };

  return (
    <div className={`border rounded-lg p-3 hover:shadow-md transition-shadow ${compact ? 'text-xs' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {post.post}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(post.scheduleDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {post.platforms.map((platform: string) => (
              <div 
                key={platform} 
                className={`w-2 h-2 rounded-full ${getPlatformColor(platform)}`}
                title={platform}
              />
            ))}
          </div>
        </div>
        {!compact && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

const CreatePostForm = ({ onSubmit, selectedDate }: { 
  onSubmit: (data: any) => void; 
  selectedDate: Date; 
}) => {
  const [formData, setFormData] = useState({
    post: '',
    platforms: [] as string[],
    scheduleDate: selectedDate.toISOString().slice(0, 16),
    mediaUrls: []
  });

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Schedule New Post</DialogTitle>
        <DialogDescription>
          Create and schedule a post across your social media platforms
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Content</label>
          <Textarea 
            placeholder="What's on your mind?"
            value={formData.post}
            onChange={(e) => setFormData(prev => ({ ...prev, post: e.target.value }))}
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Platforms</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {platforms.map(platform => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={platform.id}
                  checked={formData.platforms.includes(platform.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData(prev => ({
                        ...prev,
                        platforms: [...prev.platforms, platform.id]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        platforms: prev.platforms.filter(p => p !== platform.id)
                      }));
                    }
                  }}
                />
                <label htmlFor={platform.id} className="text-sm">
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Schedule Date & Time</label>
          <Input 
            type="datetime-local"
            value={formData.scheduleDate}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit">
            Schedule Post
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Calendar;
