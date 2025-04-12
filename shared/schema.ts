import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Articles schema with simplified category as text
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // Changed from enum to text
  authorName: text("author_name").notNull(),
  authorImageUrl: text("author_image_url"),
  published: boolean("published").notNull().default(true),
  featuredOrder: integer("featured_order"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const articlesRelations = relations(articles, ({ many }) => ({
  views: many(articleViews),
}));

// Article views for tracking view counts
export const articleViews = pgTable("article_views", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
});

export const articleViewsRelations = relations(articleViews, ({ one }) => ({
  article: one(articles, {
    fields: [articleViews.articleId],
    references: [articles.id],
  }),
}));

// Breaking news schema
export const breakingNews = pgTable("breaking_news", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema for inserting articles
export const insertArticleSchema = createInsertSchema(articles)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type ArticleView = typeof articleViews.$inferSelect;
export type BreakingNews = typeof breakingNews.$inferSelect;
