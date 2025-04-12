import { db } from "./db";
import { articles, articleViews, breakingNews, users } from "../shared/schema";
import { sql } from "drizzle-orm";
import { log } from "./vite";

async function migrate() {
  try {
    log("Starting database migration...");

    // Create tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_image_url TEXT,
        published BOOLEAN NOT NULL DEFAULT true,
        featured_order INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS article_views (
        id SERIAL PRIMARY KEY,
        article_id INTEGER NOT NULL REFERENCES articles(id),
        viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        ip_address TEXT
      );

      CREATE TABLE IF NOT EXISTS breaking_news (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    log("Migration completed successfully!");
    process.exit(0);
  } catch (error: any) {
    log(`Migration failed: ${error?.message}`);
    process.exit(1);
  }
}

migrate(); 