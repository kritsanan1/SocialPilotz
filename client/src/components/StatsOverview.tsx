
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Users, MessageSquare, Eye, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  engagementRate: number;
  topPlatform: string;
  weeklyGrowth: number;
}

export default function StatsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    totalEngagement: 0,
    totalReach: 0,
    engagementRate: 0,
    topPlatform: 'Twitter',
    weeklyGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/overview');
      const result = await response.json();
      
      if (result.success) {
        // Process analytics data from Ayrshare
        const data = result.data;
        setAnalytics({
          totalPosts: data.totalPosts || 0,
          totalEngagement: data.totalLikes + data.totalComments + data.totalShares || 0,
          totalReach: data.totalReach || 0,
          engagementRate: data.engagementRate || 0,
          topPlatform: data.topPlatform || 'Twitter',
          weeklyGrowth: data.weeklyGrowth || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use demo data if API fails
      setAnalytics({
        totalPosts: 24,
        totalEngagement: 1250,
        totalReach: 15300,
        engagementRate: 4.8,
        topPlatform: 'Twitter',
        weeklyGrowth: 12.5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Posts',
      value: analytics.totalPosts.toLocaleString(),
      icon: BarChart3,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Engagement',
      value: analytics.totalEngagement.toLocaleString(),
      icon: MessageSquare,
      change: `+${analytics.weeklyGrowth}%`,
      changeType: 'positive' as const,
    },
    {
      title: 'Total Reach',
      value: analytics.totalReach.toLocaleString(),
      icon: Eye,
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Engagement Rate',
      value: `${analytics.engagementRate}%`,
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'positive' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} from last week
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
