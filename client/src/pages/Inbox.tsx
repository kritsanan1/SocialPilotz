import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Heart, MessageCircle, Share } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  platform: string;
  platformColor: string;
  type: 'mention' | 'comment' | 'message' | 'like';
  content: string;
  author: string;
  timestamp: string;
  isRead: boolean;
  originalPost?: string;
}

export default function Inbox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const messages: Message[] = [
    {
      id: '1',
      platform: 'LinkedIn',
      platformColor: 'bg-warm-blue',
      type: 'comment',
      content: 'This is exactly what our team needed! How does the AI prioritization work?',
      author: 'Sarah Chen',
      timestamp: '2 hours ago',
      isRead: false,
      originalPost: 'Just launched our new AI-powered content scheduler!'
    },
    {
      id: '2',
      platform: 'Twitter',
      platformColor: 'bg-black',
      type: 'mention',
      content: '@socialink loving the new features! The analytics dashboard is incredible 🔥',
      author: 'Alex Rodriguez',
      timestamp: '4 hours ago',
      isRead: false
    },
    {
      id: '3',
      platform: 'Instagram',
      platformColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      type: 'comment',
      content: 'Can you do a tutorial on setting up automated posting?',
      author: 'Emma Wilson',
      timestamp: '6 hours ago',
      isRead: true,
      originalPost: 'Behind the scenes of building the next-gen social media platform'
    },
    {
      id: '4',
      platform: 'LinkedIn',
      platformColor: 'bg-warm-blue',
      type: 'like',
      content: 'liked your post',
      author: 'Marcus Johnson',
      timestamp: '8 hours ago',
      isRead: true,
      originalPost: 'Weekly industry insights: AI transformation in customer engagement'
    },
    {
      id: '5',
      platform: 'Twitter',
      platformColor: 'bg-black',
      type: 'message',
      content: 'Hi! I saw your post about social media automation. Would love to collaborate!',
      author: 'Lisa Park',
      timestamp: '1 day ago',
      isRead: true
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return MessageCircle;
      case 'mention': return Share;
      case 'like': return Heart;
      case 'message': return MessageCircle;
      default: return MessageCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-warm-blue';
      case 'mention': return 'text-sage';
      case 'like': return 'text-muted-rose';
      case 'message': return 'text-dusty-purple';
      default: return 'text-neutral-500';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !message.isRead) ||
                         (filter === 'mentions' && message.type === 'mention') ||
                         (filter === 'comments' && message.type === 'comment');
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Inbox Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Inbox</h1>
          <p className="text-neutral-600">
            Manage mentions, comments, and messages across all platforms
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-muted-rose text-white text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 mb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-messages"
              />
            </div>
            <Button variant="outline" size="sm" data-testid="button-filter">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'unread', 'mentions', 'comments'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-warm-blue text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                data-testid={`filter-${filterType}`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.map((message) => {
            const TypeIcon = getTypeIcon(message.type);
            return (
              <div
                key={message.id}
                className={`bg-white rounded-xl shadow-soft border transition-all duration-200 hover:shadow-medium ${
                  message.isRead ? 'border-neutral-200' : 'border-warm-blue/30 bg-warm-blue/5'
                }`}
                data-testid={`message-${message.id}`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-8 h-8 ${message.platformColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-medium">
                        {message.platform.substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {message.author}
                          </span>
                          <TypeIcon className={`w-3 h-3 ${getTypeColor(message.type)}`} />
                          <span className={`text-xs ${getTypeColor(message.type)} font-medium`}>
                            {message.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-neutral-500">{message.timestamp}</span>
                          <button className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 mb-2">{message.content}</p>
                      {message.originalPost && (
                        <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                          <span className="text-xs text-neutral-500">Original post:</span>
                          <p className="text-xs text-neutral-600 mt-1">{message.originalPost}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" data-testid={`button-reply-${message.id}`}>
                        Reply
                      </Button>
                      {message.type === 'comment' && (
                        <Button size="sm" variant="outline" data-testid={`button-like-${message.id}`}>
                          <Heart className="w-3 h-3 mr-1" />
                          Like
                        </Button>
                      )}
                    </div>
                    {!message.isRead && (
                      <button 
                        className="text-xs text-warm-blue font-medium hover:text-blue-600 transition-colors"
                        data-testid={`button-mark-read-${message.id}`}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMessages.length === 0 && (
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No messages found</h3>
            <p className="text-neutral-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'New mentions, comments, and messages will appear here'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
