
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

  // Social media posts endpoints
  app.post("/api/posts", async (req, res) => {
    try {
      const { content, platforms, scheduleDate, mediaUrls } = req.body;
      
      // Mock Ayrshare API call
      const ayrshareResponse = await mockAyrsharePost({
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
      
      // Mock Ayrshare delete API call
      const deleteResponse = await mockAyrshareDelete(id);
      
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

// Mock Ayrshare API functions
async function mockAyrsharePost(postData: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock successful response
  return {
    status: "success",
    ids: {
      twitter: "twitter_123",
      linkedin: "linkedin_456",
      facebook: "facebook_789",
      instagram: "instagram_101"
    },
    postId: `ayrshare_${Date.now()}`
  };
}

async function mockAyrshareDelete(postId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    status: "success",
    message: `Post ${postId} deleted successfully`
  };
}
