import postgres from 'postgres';
import { log } from './vite';

async function testDirectConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    log('No DATABASE_URL environment variable found');
    process.exit(1);
  }

  log('Attempting to connect to CockroachDB...');
  log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

  const sql = postgres(connectionString, {
    ssl: true,
    max: 1
  });

  try {
    // Test the connection
    const result = await sql`
      SELECT current_database(), version();
    `;
    
    log('Successfully connected to database!');
    log('Database:', result[0].current_database);
    log('Version:', result[0].version);

    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

    log('Existing tables:', tables.map(t => t.table_name).join(', ') || 'No tables found');

    // Create a test table
    await sql`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    log('Successfully created test table');

    // Insert a test row
    await sql`
      INSERT INTO test_connection DEFAULT VALUES;
    `;
    
    log('Successfully inserted test data');

    // Clean up
    await sql`
      DROP TABLE test_connection;
    `;
    
    log('Successfully cleaned up test table');
    
    await sql.end();
    process.exit(0);
  } catch (error: any) {
    log('Error:', error?.message || 'Unknown error');
    if (error.code) log('Error code:', error.code);
    if (error.detail) log('Error detail:', error.detail);
    process.exit(1);
  }
}

testDirectConnection(); 