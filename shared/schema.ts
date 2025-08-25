import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const socialAccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'tiktok']),
  accountId: z.string(),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const scheduledPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  platforms: z.array(z.string()),
  scheduleDate: z.string().datetime(),
  status: z.enum(['scheduled', 'published', 'failed', 'cancelled']),
  mediaUrls: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  externalIds: z.record(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const analyticsDataSchema = z.object({
  id: z.string(),
  postId: z.string(),
  platform: z.string(),
  impressions: z.number().default(0),
  engagements: z.number().default(0),
  clicks: z.number().default(0),
  shares: z.number().default(0),
  comments: z.number().default(0),
  likes: z.number().default(0),
  saves: z.number().default(0),
  reach: z.number().default(0),
  recordedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const teamMemberSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']),
  permissions: z.array(z.string()),
  invitedBy: z.string(),
  joinedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const contentTemplateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  content: z.string(),
  platforms: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(false),
  usageCount: z.number().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const mediaAssetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folder: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const engagementDataSchema = z.object({
  id: z.string(),
  postId: z.string(),
  platform: z.string(),
  type: z.enum(['comment', 'like', 'share', 'mention', 'direct_message']),
  externalId: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  isRead: z.boolean().default(false),
  isReplied: z.boolean().default(false),
  repliedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const workflowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  triggers: z.array(z.record(z.any())),
  actions: z.array(z.record(z.any())),
  isActive: z.boolean().default(true),
  executionCount: z.number().default(0),
  lastExecuted: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
export type SocialAccount = z.infer<typeof socialAccountSchema>;
export type ScheduledPost = z.infer<typeof scheduledPostSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type ContentTemplate = z.infer<typeof contentTemplateSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type EngagementData = z.infer<typeof engagementDataSchema>;
export type Workflow = z.infer<typeof workflowSchema>;