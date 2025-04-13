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
    try {
      await db.execute(sql`
        DROP TABLE IF EXISTS article_views CASCADE;
        DROP TABLE IF EXISTS articles CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS breaking_news CASCADE;
      `);
      log("Successfully dropped existing tables");
    } catch (error: any) {
      log("Error dropping tables:", error?.message);
      throw error;
    }

    // Create tables with CockroachDB-compatible syntax
    log("Creating tables...");
    
    // Create users table
    log("Creating users table...");
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username STRING NOT NULL UNIQUE,
          password STRING NOT NULL
        )
      `);
      log("Users table created successfully");
    } catch (error: any) {
      log("Error creating users table:", error?.message);
      throw error;
    }

    // Create articles table
    log("Creating articles table...");
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS articles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title STRING NOT NULL,
          slug STRING NOT NULL UNIQUE,
          summary STRING NOT NULL,
          content STRING NOT NULL,
          image_url STRING NOT NULL,
          category STRING NOT NULL,
          author_name STRING NOT NULL,
          tags STRING NOT NULL DEFAULT '[]',
          published BOOL NOT NULL DEFAULT true,
          featured_order INT,
          created_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
          updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
        )
      `);
      log("Articles table created successfully");
    } catch (error: any) {
      log("Error creating articles table:", error?.message);
      throw error;
    }

    // Create article_views table
    log("Creating article_views table...");
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS article_views (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          article_id UUID NOT NULL REFERENCES articles(id),
          viewed_at TIMESTAMP NOT NULL DEFAULT current_timestamp(),
          ip_address STRING
        )
      `);
      log("Article_views table created successfully");
    } catch (error: any) {
      log("Error creating article_views table:", error?.message);
      throw error;
    }

    // Create breaking_news table
    log("Creating breaking_news table...");
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS breaking_news (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content STRING NOT NULL,
          active BOOL NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
        )
      `);
      log("Breaking_news table created successfully");
    } catch (error: any) {
      log("Error creating breaking_news table:", error?.message);
      throw error;
    }

    // Verify tables were created
    log("Verifying tables...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    log("Created tables:", JSON.stringify(tables, null, 2));

    log("Migration completed successfully!");
    process.exit(0);
  } catch (error: any) {
    log(`Migration failed: ${error?.message}`);
    process.exit(1);
  }
}

migrate();