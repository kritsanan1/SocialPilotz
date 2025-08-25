import { Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import type { Post } from '@/types';

export default function ActivityFeed() {
  const recentPosts: Post[] = [
    {
      id: '1',
      content: 'Just launched our new AI-powered content scheduler! 🚀 Excited to see how this helps creators streamline their social media workflow.',
      platform: 'LinkedIn',
      platformIcon: 'linkedin',
      platformColor: 'bg-warm-blue',
      timestamp: '2 hours ago',
      views: '1.2K',
      likes: '47',
      comments: '12',
      engagement: '+15.3%',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'
    },
    {
      id: '2',
      content: 'The future of social media management is here! ✨ AI-powered insights, automated scheduling, and seamless multi-platform posting. What features matter most to you? #SocialMedia #AI',
      platform: 'Twitter',
      platformIcon: 'twitter',
      platformColor: 'bg-black',
      timestamp: '4 hours ago',
      views: '3.8K',
      likes: '124',
      comments: '28',
      engagement: '+24.7%'
    },
    {
      id: '3',
      content: 'Behind the scenes of building the next-gen social media platform 🎨 Swipe to see our design process!',
      platform: 'Instagram',
      platformIcon: 'instagram',
      platformColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      timestamp: '1 day ago',
      views: '2.1K',
      likes: '89',
      comments: '15',
      engagement: '+8.2%',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Posts</h2>
        <button 
          className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          data-testid="button-view-all-activity"
        >
          View All
        </button>
      </div>
      <p className="text-sm text-neutral-500 mb-4">Your latest published content performance</p>

      {recentPosts.map((post) => (
        <div 
          key={post.id}
          className="bg-white rounded-xl shadow-soft border border-neutral-200"
          data-testid={`card-post-${post.id}`}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className={`w-8 h-8 ${post.platformColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-medium">
                  {post.platform.substring(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm font-medium text-neutral-900"
                    data-testid={`text-platform-${post.id}`}
                  >
                    {post.platform}
                  </span>
                  <span 
                    className="text-xs text-neutral-500"
                    data-testid={`text-timestamp-${post.id}`}
                  >
                    {post.timestamp}
                  </span>
                </div>
                <p 
                  className="text-sm text-neutral-700 leading-relaxed"
                  data-testid={`text-content-${post.id}`}
                >
                  {post.content}
                </p>
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt="Post attachment" 
                    className="mt-3 w-full h-32 object-cover rounded-lg border border-neutral-200"
                    data-testid={`img-attachment-${post.id}`}
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-neutral-600">
                  <Eye className="w-4 h-4" />
                  <span data-testid={`text-views-${post.id}`}>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1 text-neutral-600">
                  <Heart className="w-4 h-4" />
                  <span data-testid={`text-likes-${post.id}`}>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1 text-neutral-600">
                  <MessageCircle className="w-4 h-4" />
                  <span data-testid={`text-comments-${post.id}`}>{post.comments}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-emerald-500 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                <span data-testid={`text-engagement-${post.id}`}>{post.engagement}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
