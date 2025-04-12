import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "./vite";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize the database connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: {
    rejectUnauthorized: true,
    requestCert: true
  },
  connection: {
    application_name: 'NewsBulletin'
  }
});

export const db = drizzle(client);

async function createDbConnection(retryCount = 0) {
  try {
    const maskedUrl = connectionString.replace(/:[^:@]+@/, ':****@');
    log(`Attempting to connect to database with URL: ${maskedUrl}`);
    
    // Test the connection with a simple query
    const result = await client`SELECT version()`;
    log(`Connected to database: ${result[0].version}`);
    return db;
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown error';
    const errorStack = error?.stack || '';
    log(`Database connection attempt ${retryCount + 1} failed: ${errorMessage}`);
    log(`Error stack: ${errorStack}`);
    
    if (retryCount < MAX_RETRIES) {
      log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createDbConnection(retryCount + 1);
    }
    
    throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts. Last error: ${errorMessage}`);
  }
}

export const initDb = async () => {
  try {
    await createDbConnection();
    return db;
  } catch (error: any) {
    log(`Fatal database error: ${error?.message || 'Unknown error'}`);
    process.exit(1); // Exit if we can't connect to the database
  }
};

// Handle cleanup on application shutdown
process.on('SIGINT', async () => {
  try {
    await client.end();
    log('Database connection closed.');
    process.exit(0);
  } catch (error: any) {
    log('Error closing database connection:', error?.message || 'Unknown error');
    process.exit(1);
  }
});