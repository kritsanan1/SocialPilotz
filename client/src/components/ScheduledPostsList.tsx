
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trash2, Edit } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast-messages';

interface ScheduledPost {
  id: string;
  post: string;
  platforms: string[];
  scheduleDate: string;
  status: string;
  mediaUrls?: string[];
  createdAt: string;
}

export default function ScheduledPostsList() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/posts/scheduled');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts);
      } else {
        showErrorToast('Failed to load scheduled posts');
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      showErrorToast('Error loading scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(posts.filter(post => post.id !== postId));
        showSuccessToast('Post deleted successfully');
      } else {
        showErrorToast(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showErrorToast('Error deleting post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      twitter: 'bg-blue-500',
      linkedin: 'bg-blue-600', 
      facebook: 'bg-blue-800',
      instagram: 'bg-pink-500',
      reddit: 'bg-orange-500',
      telegram: 'bg-sky-500'
    };
    return colors[platform] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="text-center py-8">Loading scheduled posts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scheduled Posts ({posts.length})</h3>
        <Button variant="outline" onClick={fetchScheduledPosts}>
          Refresh
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No scheduled posts yet</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium mb-2">
                    {post.post.substring(0, 100)}
                    {post.post.length > 100 && '...'}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Scheduled for {formatDate(post.scheduleDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {post.platforms.map((platform) => (
                  <Badge 
                    key={platform}
                    className={`text-white ${getPlatformColor(platform)}`}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                  📎 {post.mediaUrls.length} media file(s) attached
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
