import "./env"; // Import this first to ensure environment variables are loaded
import { db, createDbConnection } from "./db";
import { sql } from "drizzle-orm";
import { log } from "./vite";

async function migrate() {
  try {
    // Ensure database connection is established first
    await createDbConnection();
    
    log("Starting database migration...");

    // Drop existing tables if they exist
    log("Dropping existing tables...");
    await db.execute(sql`
      DROP TABLE IF EXISTS article_views CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS breaking_news CASCADE;
    `);

    // Create tables with CockroachDB-compatible syntax
    log("Creating tables...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username STRING NOT NULL UNIQUE,
        password STRING NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title STRING NOT NULL,
        slug STRING NOT NULL UNIQUE,
        summary STRING NOT NULL,
        content STRING NOT NULL,
        image_url STRING NOT NULL,
        category STRING NOT NULL,
        tags STRING NOT NULL DEFAULT '[]',
        published BOOL NOT NULL DEFAULT true,
        featured_order INT,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS article_views (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        article_id UUID NOT NULL REFERENCES articles(id),
        viewed_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
        ip_address STRING
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS breaking_news (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content STRING NOT NULL,
        active BOOL NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
      )
    `);

    log("Migration completed successfully!");
    process.exit(0);
  } catch (error: any) {
    log(`Migration failed: ${error?.message}`);
    process.exit(1);
  }
}

migrate();