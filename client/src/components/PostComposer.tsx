
import React, { useState } from 'react';
import { 
  Send, 
  Image, 
  Calendar, 
  Hash, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
}

const socialPlatforms: SocialPlatform[] = [
  { id: 'twitter', name: 'Twitter', color: 'bg-blue-500', enabled: true },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', enabled: true },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-700', enabled: true },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-500', enabled: false },
  { id: 'bluesky', name: 'Bluesky', color: 'bg-sky-500', enabled: true },
];

export default function PostComposer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setPostStatus('error');
      setStatusMessage('Please enter some content to post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setPostStatus('error');
      setStatusMessage('Please select at least one platform');
      return;
    }

    setIsPosting(true);
    setPostStatus('idle');

    try {
      const payload = {
        post: content,
        platforms: selectedPlatforms,
        ...(scheduleDate && { scheduleDate })
      };

      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setPostStatus('success');
        setStatusMessage(scheduleDate ? 'Post scheduled successfully!' : 'Post published successfully!');
        setContent('');
        setScheduleDate('');
      } else {
        setPostStatus('error');
        setStatusMessage(result.error || 'Failed to post content');
      }
    } catch (error) {
      setPostStatus('error');
      setStatusMessage('Network error. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const clearStatus = () => {
    setPostStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Create Post</h3>
        <div className="flex space-x-2">
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <Image className="w-4 h-4" />
          </button>
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <Hash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {postStatus !== 'idle' && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          postStatus === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {postStatus === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              postStatus === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {statusMessage}
            </span>
          </div>
          <button 
            onClick={clearStatus}
            className={`p-1 rounded hover:bg-opacity-20 ${
              postStatus === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
            }`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Post Content */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share your thoughts with your audience..."
          className="w-full p-4 border border-neutral-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          rows={4}
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-neutral-500">
            {content.length}/280 characters
          </span>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Select Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformToggle(platform.id)}
              disabled={!platform.enabled}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? `${platform.color} text-white shadow-sm`
                  : platform.enabled
                  ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {platform.name}
              {!platform.enabled && ' (Coming Soon)'}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Option */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().slice(0, 16)}
          />
          {scheduleDate && (
            <button
              onClick={() => setScheduleDate('')}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {scheduleDate && (
          <p className="text-xs text-neutral-500 mt-1 ml-7">
            <Clock className="w-3 h-3 inline mr-1" />
            Post will be scheduled for {new Date(scheduleDate).toLocaleString()}
          </p>
        )}
      </div>

      {/* Post Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePost}
          disabled={isPosting || !content.trim() || selectedPlatforms.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isPosting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{scheduleDate ? 'Schedule Post' : 'Publish Now'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
