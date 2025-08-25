import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express, { Request, Response, Router } from 'express';

const router = express.Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // Social media endpoints
  router.post('/api/social/post', async (req: Request, res: Response) => {
    try {
      const { post, platforms, mediaUrls, scheduleDate } = req.body;

      // In a real app, you'd get the API key from environment variables or user settings
      const API_KEY = process.env.AYRSHARE_API_KEY;

      if (!API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'Ayrshare API key not configured'
        });
      }

      const payload: any = {
        post,
        platforms: platforms || ['twitter', 'linkedin', 'facebook']
      };

      if (mediaUrls && mediaUrls.length > 0) {
        payload.media_urls = mediaUrls;
      }

      if (scheduleDate) {
        payload.scheduleDate = scheduleDate;
      }

      const response = await fetch('https://app.ayrshare.com/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        res.json({ success: true, data: result });
      } else {
        res.status(response.status).json({
          success: false,
          error: result.message || 'Failed to post to social media'
        });
      }
    } catch (error) {
      console.error('Social media post error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Social media endpoints
  router.get('/api/social/history', async (req: Request, res: Response) => {
    try {
      const response = await fetch('https://app.ayrshare.com/api/history', {
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Ayrshare API key not configured');
      }

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching social history:', error);
      res.status(500).json({
        success: false,
        error: 'Ayrshare API key not configured. Please add it to your environment variables.'
      });
    }
  });

  // Advanced scheduling endpoints
  router.post('/api/posts/schedule', async (req: Request, res: Response) => {
    try {
      const { post, platforms, scheduleDate, mediaUrls } = req.body;

      const postData = {
        post,
        platforms,
        scheduleDate,
        mediaUrls
      };

      const response = await fetch('https://app.ayrshare.com/api/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error scheduling post:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Bulk operations
  router.post('/api/posts/bulk', async (req: Request, res: Response) => {
    try {
      const { posts } = req.body;
      const results = [];

      for (const postData of posts) {
        const response = await fetch('https://app.ayrshare.com/api/post', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        const result = await response.json();
        results.push(result);
      }

      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Error with bulk posts:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Analytics endpoints
  router.get('/api/analytics/overview', async (req: Request, res: Response) => {
    try {
      const response = await fetch('https://app.ayrshare.com/api/analytics/post', {
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Auto hashtags
  router.post('/api/content/auto-hashtags', async (req: Request, res: Response) => {
    try {
      const { post } = req.body;

      const response = await fetch('https://app.ayrshare.com/api/auto-hashtags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post })
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error generating hashtags:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete posts
  router.delete('/api/posts/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const response = await fetch(`https://app.ayrshare.com/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Comment management
  router.get('/api/comments/:postId', async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;

      const response = await fetch(`https://app.ayrshare.com/api/comments?id=${postId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Media upload endpoint
  router.post('/api/media/upload', async (req: Request, res: Response) => {
    try {
      const { mediaUrl } = req.body;

      const response = await fetch('https://app.ayrshare.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: mediaUrl })
      });

      const data = await response.json();
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Original post history endpoint (now integrated into router)
  router.get('/api/social/history', async (req: Request, res: Response) => {
    try {
      const API_KEY = process.env.AYRSHARE_API_KEY;

      if (!API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'Ayrshare API key not configured'
        });
      }

      const response = await fetch('https://app.ayrshare.com/api/history', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        res.json({ success: true, data: result });
      } else {
        res.status(response.status).json({
          success: false,
          error: result.message || 'Failed to fetch post history'
        });
      }
    } catch (error) {
      console.error('Social media history error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Original delete post endpoint (now integrated into router)
  router.delete('/api/social/post/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const API_KEY = process.env.AYRSHARE_API_KEY;

      if (!API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'Ayrshare API key not configured'
        });
      }

      const response = await fetch(`https://app.ayrshare.com/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        res.json({ success: true, data: result });
      } else {
        res.status(response.status).json({
          success: false,
          error: result.message || 'Failed to delete post'
        });
      }
    } catch (error) {
      console.error('Social media delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  app.use('/', router); // Use the router for all routes

  const httpServer = createServer(app);

  return httpServer;
}