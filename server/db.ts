import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Notice } from "postgres";
import { log } from "./vite";
import { env } from "./env";

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Use the connection string directly for testing
const connectionString = 'postgresql://siddhesh:ECnritSNWDaN4Lu8nfn0Nw@giant-fairy-10025.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

// Configure postgres with more resilient settings
const client = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: true // Required for CockroachDB cloud
  },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  connection: {
    application_name: 'NewsBulletin'
  },
  keep_alive: 30,
  debug: env.NODE_ENV === 'development',
  transform: {
    undefined: null,
  },
  onnotice: (notice: Notice) => {
    log('Database notice:', notice.message);
  }
});

export const db = drizzle(client);

async function createDbConnection() {
  let retryCount = 0;
  while (retryCount < MAX_RETRIES) {
    try {
      const maskedUrl = connectionString.replace(/:[^:@]+@/, ':****@');
      log(`Attempting database connection (attempt ${retryCount + 1}/${MAX_RETRIES}) to ${maskedUrl}`);
      
      // Test the connection with a timeout
      const connectionPromise = client`SELECT 1`;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      log('Database connection successful');
      return client;
    } catch (error: any) {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        log(`Connection attempt failed, retrying in ${RETRY_DELAY/1000} seconds...`);
        log(`Error details: ${error?.message}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts: ${error?.message}`);
      }
    }
  }
  throw new Error('Failed to connect to database');
}

// Initialize database connection
export async function initDb() {
  try {
    await createDbConnection();
    log('Database initialized successfully');
    return db;
  } catch (error: any) {
    log('Failed to initialize database:', error?.message);
    throw error;
  }
}

// Export the connection function and db instance
export { createDbConnection };