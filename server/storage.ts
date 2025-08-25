
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Database connection
const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/social_media_db";
const client = neon(connectionString);
export const db = drizzle(client);

// Extended database schema
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  accountId: varchar("account_id").notNull(),
  accountName: varchar("account_name").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  platforms: jsonb("platforms").notNull(),
  scheduleDate: timestamp("schedule_date").notNull(),
  status: varchar("status", { length: 20 }).default("scheduled").notNull(),
  mediaUrls: jsonb("media_urls"),
  metadata: jsonb("metadata"),
  externalIds: jsonb("external_ids"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analyticsData = pgTable("analytics_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  engagements: integer("engagements").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  saves: integer("saves").default(0).notNull(),
  reach: integer("reach").default(0).notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const engagementData = pgTable("engagement_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  externalId: varchar("external_id").notNull(),
  authorId: varchar("author_id").notNull(),
  authorName: varchar("author_name").notNull(),
  authorAvatar: varchar("author_avatar"),
  content: text("content").notNull(),
  sentiment: varchar("sentiment", { length: 20 }),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  isReplied: boolean("is_replied").default(false).notNull(),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
