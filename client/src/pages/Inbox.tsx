import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageCircle,
  AtSign,
  Mail,
  Heart,
  Reply,
  Star,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';

const Inbox = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const queryClient = useQueryClient();

  const { data: inboxData, isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: async () => {
      const response = await fetch('/api/inbox');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await fetch(`/api/comments/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'mention':
        return <AtSign className="h-4 w-4" />;
      case 'direct_message':
        return <Mail className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      case 'facebook':
        return 'bg-blue-700';
      case 'instagram':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredItems = inboxData?.data?.items?.filter((item: any) => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !item.isRead) ||
      (filter === 'high-priority' && item.priority === 'high') ||
      (filter === item.type);

    const matchesSearch = searchQuery === '' || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">
            Manage all your social media interactions in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {inboxData?.data?.unreadCount || 0} unread
          </Badge>
          <Button variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{inboxData?.data?.items?.length || 0}</p>
              </div>
              <MessageCircle className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{inboxData?.data?.unreadCount || 0}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">
                  {inboxData?.data?.items?.filter((item: any) => item.priority === 'high').length || 0}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search interactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Interactions</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="high-priority">High Priority</SelectItem>
            <SelectItem value="comment">Comments</SelectItem>
            <SelectItem value="mention">Mentions</SelectItem>
            <SelectItem value="direct_message">Direct Messages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inbox Items */}
      <div className="space-y-3">
        {filteredItems.map((item: any) => (
          <InboxItem
            key={item.id}
            item={item}
            onReply={(content) => replyMutation.mutate({ id: item.id, content })}
            onClick={() => setSelectedItem(item)}
          />
        ))}

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No interactions found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Your inbox is empty. Great job staying on top of things!'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const InboxItem = ({ item, onReply, onClick }: { 
  item: any; 
  onReply: (content: string) => void;
  onClick: () => void;
}) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setIsReplyOpen(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'mention':
        return <AtSign className="h-4 w-4" />;
      case 'direct_message':
        return <Mail className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      case 'facebook':
        return 'bg-blue-700';
      case 'instagram':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getPriorityColor(item.priority)} ${!item.isRead ? 'bg-blue-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={item.authorAvatar} />
            <AvatarFallback>{item.author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{item.author}</h4>
              <Badge 
                variant="outline" 
                className={`text-xs text-white ${getPlatformColor(item.platform)}`}
              >
                {item.platform}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                {getTypeIcon(item.type)}
                <span className="text-xs capitalize">{item.type.replace('_', ' ')}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleString()}
              </span>
              {!item.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-2">{item.content}</p>

            {item.postTitle && (
              <p className="text-xs text-muted-foreground bg-gray-100 p-2 rounded">
                Re: {item.postTitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReplyOpen(!isReplyOpen)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
              <Button variant="ghost" size="sm">
                <Star className="h-3 w-3 mr-1" />
                Star
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>

            {isReplyOpen && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsReplyOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleReply}>
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Inbox;