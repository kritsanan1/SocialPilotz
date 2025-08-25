import React, { useState } from 'react';
import { Send, Image, Calendar, Zap, X, Plus, Hash, Smile, Save, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface Platform {
  id: string;
  name: string;
  color: string;
  icon: string;
  enabled: boolean;
}

// Mock types for media and loading states
interface MediaItem {
  file: File;
  preview: string;
}

const PostComposer = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'twitter']);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const [scheduledDate, setScheduledDate] = useState(''); // Added for scheduled date
  const [media, setMedia] = useState<MediaItem[]>([]); // Added for media

  const platforms: Platform[] = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', icon: 'L', enabled: true },
    { id: 'twitter', name: 'Twitter', color: 'bg-black', icon: 'X', enabled: true },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-500', icon: 'f', enabled: true },
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-br from-pink-500 to-orange-400', icon: 'I', enabled: false },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePost = async () => {
    setIsPosting(true);
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPosting(false);
    setContent('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      const payload = {
        post: content,
        platforms: selectedPlatforms,
        ...(scheduledDate && { scheduleDate: scheduledDate }),
        ...(media.length > 0 && { mediaUrls: media.map(m => m.preview) })
      };

      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to post');
      }

      const result = await response.json();
      console.log('Post successful:', result);

      // Reset form
      setContent('');
      setSelectedPlatforms(['twitter']);
      setScheduledDate('');
      setMedia([]);

      alert(scheduledDate ? 'Post scheduled successfully!' : 'Post published successfully!');
    } catch (error) {
      console.error('Post error:', error);
      alert(`Failed to post: ${error.message}`);
    }

    setIsLoading(false);
  };

  const characterCount = content.length;
  const maxChars = 280; // Twitter limit as baseline

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 truncate">Create New Post</CardTitle>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">Share your thoughts with the world</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button self-start sm:self-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Select Platforms</Label>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform.id}
                type="button"
                variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handlePlatformToggle(platform.id)}
                className={`
                  flex items-center justify-center sm:justify-start space-x-2 transition-all mobile-button min-h-[44px]
                  ${selectedPlatforms.includes(platform.id)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }
                `}
              >
                <span className="text-sm">{platform.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{platform.name}</span>
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedPlatforms.map(platformId => {
              const platform = platforms.find(p => p.id === platformId);
              return platform ? (
                <Badge key={platformId} variant="secondary" className="bg-blue-50 text-blue-700">
                  {platform.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        <Separator />

        {/* Content Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Content</Label>
            <div className={`text-xs ${characterCount > maxChars ? 'text-red-500' : 'text-slate-500'}`}>
              {characterCount}/{maxChars}
            </div>
          </div>
          <Textarea
            placeholder="What's happening? Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] resize-none border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
          />
        </div>

        {/* Content Tools */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              <Image className="w-4 h-4 mr-1" />
              Media
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              <Hash className="w-4 h-4 mr-1" />
              Tags
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              <Smile className="w-4 h-4 mr-1" />
              Emoji
            </Button>
          </div>
        </div>

        {/* Scheduling Option */}
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-600" />
            <div>
              <Label className="text-sm font-medium">Schedule for later</Label>
              <p className="text-xs text-slate-500">Post at the optimal time</p>
            </div>
          </div>
          <Switch
            checked={isScheduled}
            onCheckedChange={setIsScheduled}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 sm:space-x-4 order-2 sm:order-1">
            <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button flex-1 sm:flex-none">
              <Image className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Media</span>
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button flex-1 sm:flex-none">
              <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Schedule</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 order-1 sm:order-2">
            <Button variant="outline" className="bg-slate-50 hover:bg-slate-100 transition-colors mobile-button flex-1 sm:flex-none">
              Preview
            </Button>
            <Button 
              onClick={handleSubmit} // Changed from handlePost to handleSubmit
              disabled={!content.trim() || selectedPlatforms.length === 0 || isLoading} // Changed isPosting to isLoading
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all mobile-button flex-1 sm:flex-none"
            >
              <Send className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">{isScheduled ? 'Schedule Post' : 'Post Now'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostComposer;