import { config } from "dotenv";
import { join } from "path";
import { log } from "./vite";

const envPath = join(process.cwd(), '.env');
log(`Loading environment variables from: ${envPath}`);

// Load environment variables from .env file with override option
const result = config({ path: envPath, override: true });
log(`Dotenv config loaded:`, result.parsed ? 'Success' : 'Failed');

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'NODE_ENV'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} environment variable is required`);
  }
  log(`${envVar}:`, envVar === 'DATABASE_URL' ? process.env[envVar]?.replace(/:[^:@]+@/, ':****@') : process.env[envVar]);
}

// Export validated environment variables with proper type assertions
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
} as const; 