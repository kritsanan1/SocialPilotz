import { useState } from 'react';
import { Image, Calendar, MapPin, Hash, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { SocialPlatform } from '@/types';

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: 'bg-warm-blue', selected: true },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', color: 'bg-black', selected: true },
    { id: 'facebook', name: 'Facebook', icon: 'facebook', color: 'bg-blue-600', selected: false },
    { id: 'instagram', name: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', selected: true },
  ]);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, selected: !platform.selected }
        : platform
    ));
  };

  const handlePost = () => {
    if (!content.trim()) return;
    
    const selectedPlatforms = platforms.filter(p => p.selected);
    if (selectedPlatforms.length === 0) return;

    // TODO: Implement actual posting logic with Ayrshare API
    console.log('Posting to platforms:', selectedPlatforms, 'Content:', content);
    
    // Reset form
    setContent('');
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 mb-6">
      <div className="p-5">
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
            alt="Profile" 
            className="w-11 h-11 rounded-xl object-cover border-2 border-neutral-200"
            data-testid="img-composer-profile"
          />
          <div className="flex-1">
            <Textarea
              placeholder="What would you like to share today? Create engaging content for your audience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none border-0 focus:ring-0 text-lg placeholder:text-neutral-400 p-0"
              rows={4}
              data-testid="textarea-post-content"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-attach-media"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm">Media</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-schedule-post"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Schedule</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-add-hashtags"
            >
              <Hash className="w-4 h-4" />
              <span className="text-sm">Tags</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-add-emoji"
            >
              <Smile className="w-4 h-4" />
              <span className="text-sm">Emoji</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-neutral-500">{content.length}/280</span>
            <Button 
              onClick={handlePost}
              disabled={!content.trim() || platforms.filter(p => p.selected).length === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              data-testid="button-publish-post"
            >
              Publish
            </Button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-700">Publishing to:</span>
            <span className="text-xs text-neutral-500">{platforms.filter(p => p.selected).length} platforms selected</span>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {platforms.map((platform) => (
              <label 
                key={platform.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                  platform.selected 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                }`}
                data-testid={`label-platform-${platform.id}`}
              >
                <Checkbox
                  checked={platform.selected}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="w-4 h-4"
                  data-testid={`checkbox-platform-${platform.id}`}
                />
                <span className="text-sm font-medium">{platform.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
