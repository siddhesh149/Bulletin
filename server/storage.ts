import { 
  users, type User, type InsertUser,
  articles, type Article, type InsertArticle,
  articleViews, type ArticleView,
  breakingNews, type BreakingNews
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and, count, gte, lte } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Article operations
  async getArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    return db.select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getArticlesByCategory(category: string, limit: number = 10, offset: number = 0): Promise<Article[]> {
    return db.select()
      .from(articles)
      .where(and(eq(articles.published, true), eq(articles.category, category)))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select()
      .from(articles)
      .where(eq(articles.slug, slug));
    return article || undefined;
  }
  
  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    return db.select()
      .from(articles)
      .where(and(
        eq(articles.published, true),
        sql`${articles.featuredOrder} IS NOT NULL`
      ))
      .orderBy(articles.featuredOrder)
      .limit(limit);
  }
  
  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    return db.select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(limit);
  }
  
  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values(article)
      .returning();
    return newArticle;
  }
  
  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined> {
    const [updatedArticle] = await db
      .update(articles)
      .set({
        ...article,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle || undefined;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    const [deletedArticle] = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });
    return !!deletedArticle;
  }
  
  // Article view operations
  async recordArticleView(articleId: number, ipAddress?: string): Promise<ArticleView> {
    const [view] = await db
      .insert(articleViews)
      .values({
        articleId,
        ipAddress: ipAddress || null,
      })
      .returning();
    return view;
  }
  
  async getArticleViewCount(articleId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(articleViews)
      .where(eq(articleViews.articleId, articleId));
    return result?.count || 0;
  }
  
  async getArticleViewsByTimeRange(articleId: number, startDate: Date, endDate: Date): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(articleViews)
      .where(and(
        eq(articleViews.articleId, articleId),
        gte(articleViews.viewedAt, startDate),
        lte(articleViews.viewedAt, endDate)
      ));
    return result?.count || 0;
  }
  
  // Breaking news operations
  async getActiveBreakingNews(): Promise<BreakingNews[]> {
    return db.select()
      .from(breakingNews)
      .where(eq(breakingNews.active, true))
      .orderBy(desc(breakingNews.createdAt));
  }
  
  async createBreakingNews(content: string): Promise<BreakingNews> {
    const [news] = await db
      .insert(breakingNews)
      .values({ content })
      .returning();
    return news;
  }
  
  async updateBreakingNews(id: number, content: string, active: boolean): Promise<BreakingNews | undefined> {
    const [updatedNews] = await db
      .update(breakingNews)
      .set({ content, active })
      .where(eq(breakingNews.id, id))
      .returning();
    return updatedNews || undefined;
  }
}

export const storage = new DatabaseStorage();
