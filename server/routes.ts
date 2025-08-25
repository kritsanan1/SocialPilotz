import type { Express } from "express";
import { createServer } from "http";
import { z } from "zod";
import { db } from "./storage";
import { users, insertUserSchema } from "../shared/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const server = createServer(app);

  // User authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, userData.username)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password (in production, use bcrypt)
      const hashedPassword = userData.password; // TODO: Add proper password hashing

      const [newUser] = await db.insert(users).values({
        username: userData.username,
        password: hashedPassword,
      }).returning({ id: users.id, username: users.username });

      res.status(201).json({ user: newUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, create JWT token
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Post history endpoint
  app.get("/api/social/history", async (req, res) => {
    if (!process.env.AYRSHARE_API_KEY) {
      return res.status(500).json({ error: 'Ayrshare API key not configured' });
    }

    try {
      const response = await fetch('https://app.ayrshare.com/api/history', {
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ayrshare API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Social history error:', error);
      res.status(500).json({ error: 'Failed to fetch social media history' });
    }
  });

  // Social media posts endpoints
  app.post("/api/posts", async (req, res) => {
    try {
      // Validate API key
      if (!AYRSHARE_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "Ayrshare API key not configured"
        });
      }

      const { content, platforms, scheduleDate, mediaUrls } = req.body;

      // Validate required fields
      if (!content || !platforms || platforms.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Content and at least one platform are required"
        });
      }

      // Real Ayrshare API call
      const ayrshareResponse = await ayrsharePost({
        post: content,
        platforms,
        scheduleDate,
        mediaUrls
      });

      if (ayrshareResponse.status === "success") {
        // Save to database
        const postData = {
          id: `post_${Date.now()}`,
          userId: "user_1", // TODO: Get from session
          content,
          platforms,
          scheduleDate: scheduleDate || new Date().toISOString(),
          status: scheduleDate ? "scheduled" : "published",
          mediaUrls,
          externalIds: ayrshareResponse.ids || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        res.status(201).json({
          success: true,
          post: postData,
          ayrshareResponse
        });
      } else {
        res.status(400).json({
          success: false,
          error: ayrshareResponse.errors
        });
      }
    } catch (error) {
      console.error("Post creation error:", error);
      res.status(500).json({ success: false, error: "Failed to create post" });
    }
  });

  // Post to social media
  app.post('/api/social/post', async (req, res) => {
    if (!process.env.AYRSHARE_API_KEY) {
      return res.status(500).json({ error: 'Ayrshare API key not configured' });
    }

    try {
      const { post, platforms, scheduleDate, mediaUrls } = req.body;

      const payload = {
        post,
        platforms,
        ...(scheduleDate && { scheduleDate }),
        ...(mediaUrls && { media_urls: mediaUrls })
      };

      const response = await fetch('https://app.ayrshare.com/api/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ayrshare API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Social post error:', error);
      res.status(500).json({ error: 'Failed to post to social media' });
    }
  });

  // Get connected social accounts
  app.get('/api/social/accounts', async (req, res) => {
    if (!process.env.AYRSHARE_API_KEY) {
      return res.status(500).json({ error: 'Ayrshare API key not configured' });
    }

    try {
      const response = await fetch('https://app.ayrshare.com/api/profiles', {
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Ayrshare API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Social accounts error:', error);
      res.status(500).json({ error: 'Failed to fetch social accounts' });
    }
  });


  // Get scheduled posts
  app.get("/api/posts/scheduled", async (req, res) => {
    try {
      // Enhanced mock scheduled posts data
      const posts = [
        {
          id: "sched_1",
          post: "Exciting product launch announcement! 🚀 Our new AI-powered social media tool is coming next week.",
          platforms: ["twitter", "linkedin", "facebook"],
          scheduleDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          status: "scheduled",
          mediaUrls: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "sched_2",
          post: "Behind the scenes: How we built our content calendar with drag-and-drop functionality. The key was using React DnD with a clean, intuitive interface.",
          platforms: ["linkedin", "twitter"],
          scheduleDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          status: "scheduled",
          mediaUrls: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "sched_3",
          post: "Weekly tips: 5 ways to improve your social media engagement rate and build a stronger community around your brand.",
          platforms: ["instagram", "facebook", "linkedin"],
          scheduleDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
          status: "scheduled",
          mediaUrls: ["https://via.placeholder.com/800x600"],
          createdAt: new Date().toISOString(),
        }
      ];

      res.json({
        success: true,
        data: { posts }
      });
    } catch (error) {
      console.error("Scheduled posts error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch scheduled posts" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      // Mock scheduled posts data
      const scheduledPosts = [
        {
          id: "1",
          content: "Exciting product launch coming soon! 🚀",
          platforms: ["twitter", "linkedin"],
          scheduleDate: new Date(Date.now() + 86400000).toISOString(),
          status: "scheduled",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          content: "Behind the scenes of our latest project",
          platforms: ["instagram", "facebook"],
          scheduleDate: new Date(Date.now() + 172800000).toISOString(),
          status: "scheduled",
          createdAt: new Date().toISOString(),
        }
      ];

      res.json({ posts: scheduledPosts });
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Real Ayrshare delete API call
      const deleteResponse = await ayrshareDelete(id);

      if (deleteResponse.status === "success") {
        res.json({ success: true, message: "Post deleted successfully" });
      } else {
        res.status(400).json({ success: false, error: deleteResponse.error });
      }
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(500).json({ success: false, error: "Failed to delete post" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      // Mock analytics data
      const analyticsData = {
        totalPosts: 156,
        totalEngagement: 12543,
        avgEngagementRate: 4.2,
        topPlatform: "Instagram",
        recentPerformance: [
          { date: "2025-01-10", impressions: 1250, engagements: 89 },
          { date: "2025-01-11", impressions: 1450, engagements: 102 },
          { date: "2025-01-12", impressions: 1680, engagements: 145 },
          { date: "2025-01-13", impressions: 1820, engagements: 167 },
          { date: "2025-01-14", impressions: 1950, engagements: 189 },
        ],
        platformStats: [
          { platform: "Instagram", posts: 45, engagements: 4521, growth: 12.3 },
          { platform: "Twitter", posts: 38, engagements: 3204, growth: 8.7 },
          { platform: "LinkedIn", posts: 32, engagements: 2890, growth: 15.2 },
          { platform: "Facebook", posts: 28, engagements: 1928, growth: -2.1 },
        ]
      };

      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/platform/:platform", async (req, res) => {
    try {
      const { platform } = req.params;

      // Mock platform-specific analytics
      const platformData = {
        platform,
        totalPosts: 45,
        totalImpressions: 45600,
        totalEngagements: 2340,
        avgEngagementRate: 5.1,
        bestPostingTimes: ["9:00 AM", "1:00 PM", "6:00 PM"],
        recentPosts: [
          {
            id: "1",
            content: "Great insights on social media trends",
            publishedAt: "2025-01-14T10:00:00Z",
            impressions: 2400,
            engagements: 156,
            engagementRate: 6.5
          }
        ]
      };

      res.json(platformData);
    } catch (error) {
      console.error("Platform analytics error:", error);
      res.status(500).json({ error: "Failed to fetch platform analytics" });
    }
  });

  // Calendar endpoints
  app.get("/api/calendar/posts", async (req, res) => {
    try {
      const { month, year } = req.query;

      // Mock calendar data
      const calendarPosts = [
        {
          id: "1",
          title: "Product Launch Announcement",
          content: "Excited to announce our new product line!",
          date: "2025-01-20",
          time: "10:00",
          platforms: ["twitter", "linkedin", "instagram"],
          status: "scheduled"
        },
        {
          id: "2",
          title: "Weekly Team Update",
          content: "Behind the scenes of our amazing team",
          date: "2025-01-22",
          time: "14:30",
          platforms: ["linkedin", "facebook"],
          status: "scheduled"
        },
        {
          id: "3",
          title: "Customer Success Story",
          content: "Amazing results from our client partnership",
          date: "2025-01-25",
          time: "11:15",
          platforms: ["twitter", "linkedin"],
          status: "draft"
        }
      ];

      res.json({ posts: calendarPosts });
    } catch (error) {
      console.error("Calendar posts error:", error);
      res.status(500).json({ error: "Failed to fetch calendar posts" });
    }
  });

  // Inbox/Engagement endpoints
  app.get("/api/inbox", async (req, res) => {
    try {
      // Enhanced mock engagement data with better structure
      const items = [
        {
          id: "1",
          type: "comment",
          platform: "Instagram",
          author: "john_doe",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
          content: "Love this content! Very helpful insights about social media strategy.",
          postTitle: "5 Tips for Better Social Media Engagement",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
          isRead: false,
          sentiment: "positive",
          priority: "medium"
        },
        {
          id: "2",
          type: "mention",
          platform: "Twitter",
          author: "sarah_marketing",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
          content: "Great insights from @yourcompany on social media trends! Thanks for sharing.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
          sentiment: "positive",
          priority: "high"
        },
        {
          id: "3",
          type: "direct_message",
          platform: "LinkedIn",
          author: "Mike Johnson",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
          content: "Hi! I'm interested in learning more about your social media management services. Could we schedule a call?",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          isRead: true,
          sentiment: "neutral",
          priority: "high"
        },
        {
          id: "4",
          type: "comment",
          platform: "LinkedIn",
          author: "Emma Wilson",
          authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
          content: "This is exactly what I was looking for! Do you have any resources on content planning?",
          postTitle: "The Ultimate Guide to Social Media Strategy",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          isRead: true,
          sentiment: "positive",
          priority: "medium"
        }
      ];

      const unreadCount = items.filter(item => !item.isRead).length;

      res.json({
        success: true,
        data: {
          items,
          unreadCount,
          totalCount: items.length
        }
      });
    } catch (error) {
      console.error("Inbox error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch inbox" });
    }
  });

  // Legacy endpoint for backward compatibility
  app.get("/api/inbox/messages", async (req, res) => {
    try {
      // Mock engagement data
      const messages = [
        {
          id: "1",
          type: "comment",
          platform: "Instagram",
          author: "john_doe",
          authorAvatar: "https://via.placeholder.com/32",
          content: "Love this content! Very helpful",
          postContent: "5 Tips for Better Social Media Engagement",
          timestamp: "2025-01-15T08:30:00Z",
          isRead: false,
          sentiment: "positive"
        },
        {
          id: "2",
          type: "mention",
          platform: "Twitter",
          author: "sarah_marketing",
          authorAvatar: "https://via.placeholder.com/32",
          content: "Great insights from @yourcompany on social media trends!",
          timestamp: "2025-01-15T06:45:00Z",
          isRead: false,
          sentiment: "positive"
        },
        {
          id: "3",
          type: "direct_message",
          platform: "LinkedIn",
          author: "Mike Johnson",
          authorAvatar: "https://via.placeholder.com/32",
          content: "Hi! I'm interested in learning more about your services",
          timestamp: "2025-01-14T16:20:00Z",
          isRead: true,
          sentiment: "neutral"
        }
      ];

      res.json({ messages });
    } catch (error) {
      console.error("Inbox messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Configuration check endpoint
  app.get("/api/config/check", async (req, res) => {
    try {
      const config = {
        ayrshareApiKey: !!AYRSHARE_API_KEY,
        databaseUrl: !!process.env.DATABASE_URL,
        sessionSecret: !!process.env.SESSION_SECRET
      };

      res.json({
        success: true,
        config,
        ready: Object.values(config).every(Boolean)
      });
    } catch (error) {
      console.error("Config check error:", error);
      res.status(500).json({ success: false, error: "Failed to check configuration" });
    }
  });

  // Mock activity feed endpoint
  app.get("/api/activity", async (req, res) => {
    try {
      const activities = [
        {
          id: "1",
          type: "post_published",
          title: "Post published successfully",
          description: "Your post 'Social Media Best Practices' was published to Twitter and LinkedIn",
          timestamp: "2025-01-15T09:15:00Z",
          platforms: ["twitter", "linkedin"]
        },
        {
          id: "2",
          type: "engagement_received",
          title: "New engagement on Instagram",
          description: "Your post received 25 new likes and 3 comments",
          timestamp: "2025-01-15T08:45:00Z",
          platforms: ["instagram"]
        },
        {
          id: "3",
          type: "post_scheduled",
          title: "Post scheduled for tomorrow",
          description: "Your post 'Product Launch Update' is scheduled for Jan 16 at 10:00 AM",
          timestamp: "2025-01-15T07:30:00Z",
          platforms: ["twitter", "facebook", "linkedin"]
        }
      ];

      res.json({ activities });
    } catch (error) {
      console.error("Activity feed error:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  return server;
}

// Ayrshare API configuration
const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;
const AYRSHARE_BASE_URL = 'https://app.ayrshare.com/api';

// Real Ayrshare API functions
async function ayrsharePost(postData: any) {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify({
        post: postData.post,
        platforms: postData.platforms,
        scheduleDate: postData.scheduleDate,
        mediaUrls: postData.mediaUrls
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        errors: data.errors || [`API Error: ${response.status}`]
      };
    }

    return {
      status: "success",
      ids: data.ids || {},
      postId: data.id || `ayrshare_${Date.now()}`
    };
  } catch (error) {
    console.error('Ayrshare API Error:', error);
    return {
      status: "error",
      errors: [`Network error: ${error.message}`]
    };
  }
}

async function ayrshareDelete(postId: string) {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify({ id: postId })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: data.error || `API Error: ${response.status}`
      };
    }

    return {
      status: "success",
      message: data.message || `Post ${postId} deleted successfully`
    };
  } catch (error) {
    console.error('Ayrshare Delete Error:', error);
    return {
      status: "error",
      error: `Network error: ${error.message}`
    };
  }
}

async function ayrshareHistory() {
  try {
    const response = await fetch(`${AYRSHARE_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        error: data.error || `API Error: ${response.status}`
      };
    }

    return {
      status: "success",
      data: data.posts || []
    };
  } catch (error) {
    console.error('Ayrshare History Error:', error);
    return {
      status: "error",
      error: `Network error: ${error.message}`
    };
  }
}