import React from 'react';
import { Calendar, TrendingUp, Users, BarChart3, Clock, MessageSquare, Target, Zap } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import ActivityFeed from '../components/ActivityFeed';
import ScheduledPostsList from '../components/ScheduledPostsList';
import AnalyticsPreview from '../components/AnalyticsPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEO from '../components/SEO';
import { organizationSchema, softwareApplicationSchema, webSiteSchema } from '../utils/structuredData';

// Assuming PostComposer component is defined elsewhere and imported
// import PostComposer from '../components/PostComposer'; 

const Dashboard = () => {
  const quickActions = [
    { icon: MessageSquare, label: 'Create Post', color: 'bg-blue-500', href: '#' },
    { icon: Calendar, label: 'Schedule', color: 'bg-green-500', href: '#' },
    { icon: BarChart3, label: 'Analytics', color: 'bg-purple-500', href: '/analytics' },
    { icon: Users, label: 'Audience', color: 'bg-orange-500', href: '#' },
  ];

  const insights = [
    { title: 'Best Time to Post', value: '2:00 PM EST', trend: '+12%', icon: Clock },
    { title: 'Top Platform', value: 'LinkedIn', trend: '+8%', icon: Target },
    { title: 'Engagement Rate', value: '4.2%', trend: '+15%', icon: TrendingUp },
    { title: 'Active Followers', value: '2.4K', trend: '+6%', icon: Users },
  ];

  return (
    <>
      <SEO 
        title="SociaLink Dashboard - Social Media Management Platform"
        description="Manage all your social media accounts from one dashboard. Schedule posts, track analytics, and engage with your audience across multiple platforms."
        keywords="social media dashboard, social media management, post scheduling, social analytics"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, softwareApplicationSchema, webSiteSchema]
        }}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" role="main">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <header className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Good morning, Sarah! 👋
              </h1>
              <p className="text-slate-600 text-lg">
                Ready to create some amazing content today?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="px-4 py-2 bg-green-50 text-green-700 border-green-200">
                <Zap className="w-4 h-4 mr-1" />
                All Systems Active
              </Badge>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{action.label}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Overview */}
        <section aria-labelledby="stats-overview-heading">
          <h2 id="stats-overview-heading" className="sr-only">Statistics Overview</h2>
          <StatsOverview />
        </section>

        {/* Insights Grid */}
        <section aria-labelledby="insights-heading">
          <h2 id="insights-heading" className="sr-only">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <insight.icon className="w-8 h-8 text-slate-600" />
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                      {insight.trend}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{insight.value}</h3>
                  <p className="text-sm text-slate-600">{insight.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Post Composer & Activity */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Placeholder for PostComposer as it was not in the original code */}
            {/* <PostComposer /> */}
            <ActivityFeed />
          </div>

          {/* Right Column - Analytics & Scheduled Posts */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <AnalyticsPreview />
            <ScheduledPostsList />
          </div>
        </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;