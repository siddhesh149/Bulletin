import pg from 'pg';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

async function testConnection() {
  // Using the connection string directly for testing
  const connectionString = 'postgresql://siddhesh:ECnritSNWDaN4Lu8nfn0Nw@giant-fairy-10025.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';
  
  const client = new pg.Client({
    connectionString,
    ssl: true
  });

  try {
    console.log('Attempting to connect to database...');
    console.log('Using connection string:', connectionString.replace(/:[^:]*@/, ':****@'));
    await client.connect();
    console.log('Successfully connected to database!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('Test query result:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('Error connecting to database:', error);
    // Print more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }
}

testConnection(); 