import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { log } from "./vite";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function createDbConnection(retryCount = 0) {
  try {
    const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
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
    const db = await createDbConnection();
    return db;
  } catch (error: any) {
    log(`Fatal database error: ${error?.message || 'Unknown error'}`);
    throw error;
  }
};