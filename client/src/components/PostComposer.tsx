
import React, { useState } from 'react';
import { Send, Image, Calendar, Zap, X, Plus, Hash, Smile } from 'lucide-react';
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

const PostComposer = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'twitter']);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

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

  const characterCount = content.length;
  const maxChars = 280; // Twitter limit as baseline

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          Create New Post
        </CardTitle>
        <CardDescription>
          Compose and share across all your connected platforms
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Platform Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Select Platforms</Label>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedPlatforms.includes(platform.id) ? 'scale-105' : 'hover:scale-105'
                } ${!platform.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => platform.enabled && handlePlatformToggle(platform.id)}
              >
                <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                  selectedPlatforms.includes(platform.id) ? 'ring-4 ring-blue-200' : ''
                }`}>
                  {platform.icon}
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white rotate-45" />
                  </div>
                )}
                {!platform.enabled && (
                  <div className="absolute inset-0 bg-slate-400/50 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
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
            className="min-h-[120px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-base"
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
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handlePost}
            disabled={!content.trim() || selectedPlatforms.length === 0 || isPosting}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg transition-all duration-200"
          >
            {isPosting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Publishing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {isScheduled ? 'Schedule Post' : 'Post Now'}
              </div>
            )}
          </Button>
          <Button variant="outline" className="h-12 px-6">
            Save Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostComposer;
