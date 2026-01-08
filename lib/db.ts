import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Warn but don't throw during build
if (!connectionString) {
  console.warn('⚠️  DATABASE_URL not set - using local fallback');
}

const pool = new Pool({
  connectionString: connectionString || 'postgresql://postgres:postgres@db:5432/fdm',
  ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

export default pool;
