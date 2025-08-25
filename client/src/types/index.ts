export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  selected: boolean;
}

export interface Post {
  id: string;
  content: string;
  platform: string;
  platformIcon: string;
  platformColor: string;
  timestamp: string;
  views: string;
  likes: string;
  comments: string;
  engagement: string;
  imageUrl?: string;
}

export interface UpcomingPost {
  id: string;
  content: string;
  scheduledTime: string;
  platforms: SocialPlatform[];
  status: 'scheduled' | 'draft' | 'published';
}

export interface AnalyticsData {
  totalReach: string;
  reachChange: string;
  engagement: string;
  engagementChange: string;
  impressions: string;
  impressionsChange: string;
  engagementRate: string;
  engagementRateChange: string;
  bestTimeToPost: string;
  bestDaysToPost: string;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}
