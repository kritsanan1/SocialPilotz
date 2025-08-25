import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Social Media Posting Routes
  app.post('/api/social/post', async (req, res) => {
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

  app.get('/api/social/history', async (req, res) => {
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

  app.delete('/api/social/post/:id', async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
