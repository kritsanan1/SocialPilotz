
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
  ExternalLink
} from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
        <button 
          onClick={fetchPostHistory}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {displayPosts.map((post) => (
          <div 
            key={post.id} 
            className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {post.platforms.map((platform) => {
                  const Icon = platformIcons[platform];
                  return Icon ? (
                    <Icon 
                      key={platform} 
                      className={`w-4 h-4 ${platformColors[platform]}`} 
                    />
                  ) : (
                    <div 
                      key={platform}
                      className="w-4 h-4 bg-neutral-400 rounded-full"
                    />
                  );
                })}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : post.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1 text-neutral-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-neutral-800 text-sm mb-3 leading-relaxed">
              {post.post}
            </p>

            {/* Post Meta */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center space-x-4">
                {post.status === 'scheduled' && post.scheduled ? (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Scheduled for {new Date(post.scheduled).toLocaleDateString()} at{' '}
                      {new Date(post.scheduled).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <span>
                    Posted {new Date(post.created).toLocaleDateString()} at{' '}
                    {new Date(post.created).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Analytics (for published posts) */}
              {post.status === 'published' && post.analytics && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.analytics.likes || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="w-3 h-3" />
                    <span>{post.analytics.shares || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{post.analytics.comments || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayPosts.length === 0 && !loading && (
        <div className="text-center py-8 text-neutral-500">
          <p>No posts yet. Create your first post above!</p>
        </div>
      )}
    </div>
  );
}
