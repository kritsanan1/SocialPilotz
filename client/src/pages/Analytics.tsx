import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, MessageSquare, Share2, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SEO from '../components/SEO';
import { breadcrumbSchema } from "../utils/structuredData";

export default function Analytics() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/overview");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    }
  });

  const { data: platformData } = useQuery({
    queryKey: ["analytics", "platform", selectedPlatform],
    queryFn: async () => {
      if (selectedPlatform === "all") return null;
      const response = await fetch(`/api/analytics/platform/${selectedPlatform}`);
      if (!response.ok) throw new Error("Failed to fetch platform analytics");
      return response.json();
    },
    enabled: selectedPlatform !== "all"
  });

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Social Media Analytics - Track Performance | SociaLink"
          description="Comprehensive social media analytics dashboard. Track engagement, reach, followers, and performance across all your social media platforms."
          keywords="social media analytics, social media metrics, engagement tracking, social media insights, performance analytics"
          structuredData={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://example.com",
                "name": "SociaLink",
                "logo": "https://example.com/logo.png",
                "sameAs": [
                  "https://twitter.com/example",
                  "https://www.linkedin.com/company/example"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Dashboard",
                    "item": "https://example.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Analytics",
                    "item": "https://example.com/analytics"
                  }
                ]
              }
            ]
          }}
        />
        <main className="container mx-auto p-6 space-y-8" role="main">
          <div className="animate-pulse space-y-4">
            <header>
              <h1 className="text-3xl font-bold mb-8">Social Media Analytics Dashboard</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Social Media Analytics - Track Performance | SociaLink"
        description="Comprehensive social media analytics dashboard. Track engagement, reach, followers, and performance across all your social media platforms."
        keywords="social media analytics, social media metrics, engagement tracking, social media insights, performance analytics"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "url": "https://example.com",
              "name": "SociaLink",
              "logo": "https://example.com/logo.png",
              "sameAs": [
                "https://twitter.com/example",
                "https://www.linkedin.com/company/example"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Dashboard",
                  "item": "https://example.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Analytics",
                  "item": "https://example.com/analytics"
                }
              ]
            }
          ]
        }}
      />
      <main className="container mx-auto p-6 space-y-8" role="main">
        <div className="flex items-center justify-between">
          <header>
            <h1 className="text-3xl font-bold mb-8">Social Media Analytics Dashboard</h1>
          </header>
          <div className="flex gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="border rounded px-3 py-1 bg-background"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalEngagement?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.avgEngagementRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.topPlatform || "N/A"}</div>
              <p className="text-xs text-muted-foreground">
                Highest engagement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.recentPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagements" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="impressions" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.platformStats?.map((platform: any, index: number) => (
                  <div key={platform.platform} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        platform.platform === 'Instagram' ? 'bg-pink-500' :
                        platform.platform === 'Twitter' ? 'bg-blue-500' :
                        platform.platform === 'LinkedIn' ? 'bg-blue-700' :
                        'bg-blue-600'
                      }`}></div>
                      <div>
                        <div className="font-medium">{platform.platform}</div>
                        <div className="text-sm text-muted-foreground">{platform.posts} posts</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{platform.engagements.toLocaleString()}</div>
                      <div className={`text-sm ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {platform.growth >= 0 ? '+' : ''}{platform.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}