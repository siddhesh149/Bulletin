import { db } from "./db";
import { log } from "./vite";
import { sql } from "drizzle-orm";

async function testConnection() {
  try {
    log("Testing database connection...");
    
    // Test basic connection
    const result = await db.execute(sql`SELECT current_database()`);
    log("Successfully connected to database:", result[0].current_database);
    
    // Check if tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    log("Existing tables:", tables.map(t => t.table_name).join(", ") || "No tables found");
    
    process.exit(0);
  } catch (error: any) {
    log("Error testing connection:", error?.message || "Unknown error");
    process.exit(1);
  }
}

testConnection(); 