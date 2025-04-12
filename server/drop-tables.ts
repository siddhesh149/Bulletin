import { db } from "./db";
import { sql } from "drizzle-orm";

async function dropTables() {
  try {
    await db.execute(sql`
      DROP TABLE IF EXISTS article_views CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS breaking_news CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log("All tables dropped successfully!");
  } catch (error) {
    console.error("Error dropping tables:", error);
  }
}

dropTables(); 