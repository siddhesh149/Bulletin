import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { log } from "./vite";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

async function createDbConnection(retryCount = 0) {
  try {
    await sql`SELECT 1`; // Test the connection
    log("Database connected successfully");
    return db;
  } catch (error: any) {
    log(`Database connection attempt ${retryCount + 1} failed: ${error?.message || 'Unknown error'}`);
    
    if (retryCount < MAX_RETRIES) {
      log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createDbConnection(retryCount + 1);
    }
    
    throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts`);
  }
}

export const initDb = async () => {
  try {
    await createDbConnection();
    return db;
  } catch (error: any) {
    log(`Fatal database error: ${error?.message || 'Unknown error'}`);
    throw error;
  }
};