
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, X, Send, Calendar } from 'lucide-react';

interface BulkPost {
  id: string;
  content: string;
  platforms: string[];
  scheduleDate?: string;
}

export default function BulkPostManager() {
  const [posts, setPosts] = useState<BulkPost[]>([
    { id: '1', content: '', platforms: ['twitter'], scheduleDate: '' }
  ]);
  const [isPosting, setIsPosting] = useState(false);

  const platforms = [
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
  ];

  const addPost = () => {
    const newPost: BulkPost = {
      id: Date.now().toString(),
      content: '',
      platforms: ['twitter'],
      scheduleDate: ''
    };
    setPosts([...posts, newPost]);
  };

  const removePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const updatePost = (id: string, field: keyof BulkPost, value: any) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, [field]: value } : post
    ));
  };

  const togglePlatform = (postId: string, platformId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const platforms = post.platforms.includes(platformId)
      ? post.platforms.filter(p => p !== platformId)
      : [...post.platforms, platformId];
    
    updatePost(postId, 'platforms', platforms);
  };

  const handleBulkPost = async () => {
    const validPosts = posts.filter(post => 
      post.content.trim() && post.platforms.length > 0
    );

    if (validPosts.length === 0) {
      alert('Please add at least one valid post');
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch('/api/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: validPosts })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Successfully posted ${validPosts.length} posts!`);
        setPosts([{ id: '1', content: '', platforms: ['twitter'], scheduleDate: '' }]);
      } else {
        alert('Some posts failed to publish. Check the console for details.');
      }
    } catch (error) {
      console.error('Bulk posting error:', error);
      alert('Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Bulk Post Manager
          <Button onClick={addPost} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post, index) => (
          <Card key={post.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium">Post {index + 1}</span>
              {posts.length > 1 && (
                <Button
                  onClick={() => removePost(post.id)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <Textarea
              placeholder="What's on your mind?"
              value={post.content}
              onChange={(e) => updatePost(post.id, 'content', e.target.value)}
              className="mb-3"
            />

            <div className="flex flex-wrap gap-2 mb-3">
              {platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant={post.platforms.includes(platform.id) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    post.platforms.includes(platform.id) ? platform.color + ' text-white' : ''
                  }`}
                  onClick={() => togglePlatform(post.id, platform.id)}
                >
                  {platform.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <input
                type="datetime-local"
                value={post.scheduleDate}
                onChange={(e) => updatePost(post.id, 'scheduleDate', e.target.value)}
                className="text-sm border rounded px-2 py-1"
              />
            </div>
          </Card>
        ))}

        <div className="flex justify-end pt-4">
          <Button onClick={handleBulkPost} disabled={isPosting}>
            {isPosting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post All ({posts.filter(p => p.content.trim()).length})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
