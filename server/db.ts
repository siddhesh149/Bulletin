import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "./vite";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Initialize the database connection
const client = postgres(process.env.DATABASE_URL!, {
  max: 1,
  ssl: {
    rejectUnauthorized: false // Required for CockroachDB's SSL
  }
});
export const db = drizzle(client);

async function createDbConnection(retryCount = 0) {
  try {
    log(`Attempting to connect to database with URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);
    // Test the connection with a simple query
    const result = await client`SELECT 1`;
    if (result) {
      log("Database connected successfully");
      return db;
    }
    throw new Error("Database connection test failed");
  } catch (error: any) {
    log(`Database connection attempt ${retryCount + 1} failed: ${error?.message || 'Unknown error'}`);
    log(`Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    
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