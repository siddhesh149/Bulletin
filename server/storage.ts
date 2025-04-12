import { 
  users, type User, type InsertUser,
  articles, type Article, type InsertArticle,
  articleViews, type ArticleView,
  breakingNews, type BreakingNews
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, count, gte, lte } from "drizzle-orm";
import { log } from "./vite";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article operations
  getArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticlesByCategory(category: string, limit?: number, offset?: number): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  
  // Article view operations
  recordArticleView(articleId: number, ipAddress?: string): Promise<ArticleView>;
  getArticleViewCount(articleId: number): Promise<number>;
  getArticleViewsByTimeRange(articleId: number, startDate: Date, endDate: Date): Promise<number>;
  
  // Breaking news operations
  getActiveBreakingNews(): Promise<BreakingNews[]>;
  createBreakingNews(content: string): Promise<BreakingNews>;
  updateBreakingNews(id: number, content: string, active: boolean): Promise<BreakingNews | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error: any) {
      log(`Error getting user: ${error?.message}`);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error: any) {
      log(`Error getting user by username: ${error?.message}`);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error: any) {
      log(`Error creating user: ${error?.message}`);
      throw error;
    }
  }
  
  // Article operations
  async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    try {
      return await db.select()
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error: any) {
      log(`Error getting articles: ${error?.message}`);
      throw error;
    }
  }
  
  async getArticlesByCategory(category: string, limit: number = 10, offset: number = 0): Promise<Article[]> {
    try {
      return await db.select()
        .from(articles)
        .where(and(eq(articles.published, true), eq(articles.category, category)))
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error: any) {
      log(`Error getting articles by category: ${error?.message}`);
      throw error;
    }
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    try {
      const [article] = await db.select()
        .from(articles)
        .where(eq(articles.slug, slug));
      return article || undefined;
    } catch (error: any) {
      log(`Error getting article by slug: ${error?.message}`);
      throw error;
    }
  }
  
  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      return await db.select()
        .from(articles)
        .where(and(
          eq(articles.published, true),
          sql`${articles.featuredOrder} IS NOT NULL`
        ))
        .orderBy(articles.featuredOrder)
        .limit(limit);
    } catch (error: any) {
      log(`Error getting featured articles: ${error?.message}`);
      throw error;
    }
  }
  
  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    try {
      return await db.select()
        .from(articles)
        .where(eq(articles.published, true))
        .orderBy(desc(articles.createdAt))
        .limit(limit);
    } catch (error: any) {
      log(`Error getting latest articles: ${error?.message}`);
      throw error;
    }
  }
  
  async createArticle(article: InsertArticle): Promise<Article> {
    try {
      const [newArticle] = await db.insert(articles).values(article).returning();
      return newArticle;
    } catch (error: any) {
      log(`Error creating article: ${error?.message}`);
      throw error;
    }
  }
  
  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    try {
      const [updatedArticle] = await db.update(articles)
        .set({
          ...article,
          updatedAt: new Date()
        })
        .where(eq(articles.id, id))
        .returning();
      return updatedArticle || undefined;
    } catch (error: any) {
      log(`Error updating article: ${error?.message}`);
      throw error;
    }
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    try {
      const [deletedArticle] = await db.delete(articles)
        .where(eq(articles.id, id))
        .returning({ id: articles.id });
      return !!deletedArticle;
    } catch (error: any) {
      log(`Error deleting article: ${error?.message}`);
      throw error;
    }
  }
  
  // Article view operations
  async recordArticleView(articleId: number, ipAddress?: string): Promise<ArticleView> {
    try {
      const [view] = await db.insert(articleViews)
        .values({
          articleId,
          ipAddress: ipAddress || null,
        })
        .returning();
      return view;
    } catch (error: any) {
      log(`Error recording article view: ${error?.message}`);
      throw error;
    }
  }
  
  async getArticleViewCount(articleId: number): Promise<number> {
    try {
      const [result] = await db.select({ count: count() })
        .from(articleViews)
        .where(eq(articleViews.articleId, articleId));
      return result?.count || 0;
    } catch (error: any) {
      log(`Error getting article view count: ${error?.message}`);
      throw error;
    }
  }
  
  async getArticleViewsByTimeRange(articleId: number, startDate: Date, endDate: Date): Promise<number> {
    try {
      const [result] = await db.select({ count: count() })
        .from(articleViews)
        .where(and(
          eq(articleViews.articleId, articleId),
          gte(articleViews.viewedAt, startDate),
          lte(articleViews.viewedAt, endDate)
        ));
      return result?.count || 0;
    } catch (error: any) {
      log(`Error getting article views by time range: ${error?.message}`);
      throw error;
    }
  }
  
  // Breaking news operations
  async getActiveBreakingNews(): Promise<BreakingNews[]> {
    try {
      return await db.select()
        .from(breakingNews)
        .where(eq(breakingNews.active, true))
        .orderBy(desc(breakingNews.createdAt));
    } catch (error: any) {
      log(`Error getting active breaking news: ${error?.message}`);
      throw error;
    }
  }
  
  async createBreakingNews(content: string): Promise<BreakingNews> {
    try {
      const [news] = await db.insert(breakingNews)
        .values({ content })
        .returning();
      return news;
    } catch (error: any) {
      log(`Error creating breaking news: ${error?.message}`);
      throw error;
    }
  }
  
  async updateBreakingNews(id: number, content: string, active: boolean): Promise<BreakingNews | undefined> {
    try {
      const [updatedNews] = await db.update(breakingNews)
        .set({ content, active })
        .where(eq(breakingNews.id, id))
        .returning();
      return updatedNews || undefined;
    } catch (error: any) {
      log(`Error updating breaking news: ${error?.message}`);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
