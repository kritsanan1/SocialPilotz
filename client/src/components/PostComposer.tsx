import { useState } from 'react';
import { Image, Calendar, MapPin } from 'lucide-react';
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
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40" 
            alt="Profile" 
            className="w-10 h-10 rounded-lg object-cover"
            data-testid="img-composer-profile"
          />
          <div className="flex-1">
            <Textarea
              placeholder="What's happening? Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none border-neutral-200 focus:border-warm-blue focus:ring-2 focus:ring-warm-blue/20 transition-all"
              rows={3}
              data-testid="textarea-post-content"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-attach-media"
            >
              <Image className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-schedule-post"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              data-testid="button-add-location"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
          
          <Button 
            onClick={handlePost}
            disabled={!content.trim() || platforms.filter(p => p.selected).length === 0}
            className="bg-warm-blue hover:bg-blue-600 text-white"
            data-testid="button-publish-post"
          >
            Post Now
          </Button>
        </div>

        {/* Platform Selection */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-neutral-600 mr-2">Post to:</span>
            {platforms.map((platform) => (
              <label 
                key={platform.id}
                className="flex items-center space-x-2 bg-neutral-100 px-3 py-1 rounded-full cursor-pointer hover:bg-neutral-200 transition-colors"
                data-testid={`label-platform-${platform.id}`}
              >
                <Checkbox
                  checked={platform.selected}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="w-3 h-3"
                  data-testid={`checkbox-platform-${platform.id}`}
                />
                <span className="text-xs font-medium">{platform.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
