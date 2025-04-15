import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiRouter = '/api';

  // Articles routes
  app.get(`${apiRouter}/articles`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const articles = await storage.getArticles(limit, offset);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get(`${apiRouter}/articles/featured`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const articles = await storage.getFeaturedArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  app.get(`${apiRouter}/articles/latest`, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching latest articles:", error);
      res.status(500).json({ message: "Failed to fetch latest articles" });
    }
  });

  app.get(`${apiRouter}/articles/category/:category`, async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const articles = await storage.getArticlesByCategory(category, limit, offset);
      res.json(articles);
    } catch (error) {
      console.error(`Error fetching articles for category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch articles by category" });
    }
  });

  app.get(`${apiRouter}/articles/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Get related articles from the same category
      const relatedArticles = await storage.getArticlesByCategory(article.category, 4);
      const filteredRelatedArticles = relatedArticles.filter(related => related.id !== article.id);
      
      res.json({
        article,
        relatedArticles: filteredRelatedArticles.slice(0, 3) // Limit to 3 related articles
      });
    } catch (error) {
      console.error(`Error fetching article ${req.params.slug}:`, error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post(`${apiRouter}/articles`, async (req: Request, res: Response) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put(`${apiRouter}/articles/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const articleData = insertArticleSchema.partial().parse(req.body);
      
      const updatedArticle = await storage.updateArticle(id, articleData);
      
      if (!updatedArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(updatedArticle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error(`Error updating article ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete(`${apiRouter}/articles/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting article ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Breaking news routes
  app.get(`${apiRouter}/breaking-news`, async (_req: Request, res: Response) => {
    try {
      const breakingNews = await storage.getActiveBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  app.post(`${apiRouter}/breaking-news`, async (req: Request, res: Response) => {
    try {
      const contentSchema = z.object({
        content: z.string().min(1),
      });
      
      const { content } = contentSchema.parse(req.body);
      const news = await storage.createBreakingNews(content);
      
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating breaking news:", error);
      res.status(500).json({ message: "Failed to create breaking news" });
    }
  });

  app.put(`${apiRouter}/breaking-news/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = z.object({
        content: z.string().min(1),
        active: z.boolean(),
      });
      
      const { content, active } = updateSchema.parse(req.body);
      const news = await storage.updateBreakingNews(id, content, active);
      
      if (!news) {
        return res.status(404).json({ message: "Breaking news not found" });
      }
      
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error(`Error updating breaking news ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update breaking news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
