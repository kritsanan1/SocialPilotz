import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Image, Send, Clock, Hash, Sparkles, BarChart3, Target, CheckCircle2, AlertCircle, X } from 'lucide-react';

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
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [contentType, setContentType] = useState('general');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const platforms = [
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-500' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-gray-900' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
    { id: 'threads', name: 'Threads', color: 'bg-gray-800' },
    { id: 'bluesky', name: 'Bluesky', color: 'bg-sky-500' },
  ];

  const contentTypes = [
    { value: 'general', label: 'General Content' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'educational', label: 'Educational' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'news', label: 'News & Updates' },
    { value: 'personal', label: 'Personal Story' },
  ];

  const generateHashtags = async () => {
    if (!content.trim()) return;

    setIsGeneratingHashtags(true);
    try {
      const response = await fetch('/api/content/auto-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: content }),
      });

      const result = await response.json();
      if (result.success) {
        setSuggestedHashtags(result.data.hashtags || []);
      }
    } catch (error) {
      console.error('Error generating hashtags:', error);
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const addHashtag = (hashtag: string) => {
    if (!content.includes(hashtag)) {
      setContent(prev => prev + ' ' + hashtag);
    }
  };

  useEffect(() => {
    if (content.length > 50) {
      const timer = setTimeout(generateHashtags, 2000);
      return () => clearTimeout(timer);
    }
  }, [content]);

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
        ...(scheduleDate && scheduleTime && { scheduleDateTime: `${scheduleDate}T${scheduleTime}:00` })
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
        setScheduleTime('');
        setShowScheduler(false);
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

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prevSelected =>
      prevSelected.includes(platformId)
        ? prevSelected.filter(id => id !== platformId)
        : [...prevSelected, platformId]
    );
  };

  return (
    <Card className="w-full max-w-xl mx-auto my-8 shadow-lg border-neutral-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-neutral-800">Create a New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={generateHashtags} disabled={isGeneratingHashtags}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingHashtags ? 'Generating...' : 'AI Assist'}
            </Button>
          </div>

          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-0 text-base placeholder:text-gray-400 focus-visible:ring-0"
          />

          {suggestedHashtags.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">Suggested hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedHashtags.map((hashtag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => addHashtag(hashtag)}
                  >
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? `${platform.color} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>

          {/* Status Messages */}
          {postStatus !== 'idle' && (
            <div className={`p-3 rounded-lg flex items-center justify-between ${
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


          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-2" />
                Media
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScheduler(!showScheduler)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4" />
              </Button>
              <Button disabled={!content.trim() || selectedPlatforms.length === 0 || isPosting}>
                {isPosting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2">Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Now
                  </>
                )}
              </Button>
            </div>
          </div>

          {showScheduler && (
            <div className="p-4 bg-gray-50 rounded-lg border-t space-y-3">
              <p className="text-sm font-medium text-gray-700">Schedule for later</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="text-sm"
                />
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={handlePost} disabled={!content.trim() || selectedPlatforms.length === 0 || isPosting}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" size="sm">
                  Best Time
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}