const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_uD0xXYSdbtM9@ep-winter-lab-a4lwdik7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  try {
    console.log('Connecting to Neon database...');
    
    // Drop existing tables
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS ads CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create ads table
    await pool.query(`
      CREATE TABLE ads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        location VARCHAR(255),
        image_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Ads table created');

    // Create indexes
    await pool.query('CREATE INDEX idx_ads_user_id ON ads(user_id)');
    await pool.query('CREATE INDEX idx_ads_category ON ads(category)');
    await pool.query('CREATE INDEX idx_ads_status ON ads(status)');
    console.log('✓ Indexes created');

    // Verify schema
    const cols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('\nUsers columns:', cols.rows.map(r => r.column_name).join(', '));

    const adsCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ads'
    `);
    console.log('Ads columns:', adsCols.rows.map(r => r.column_name).join(', '));

    console.log('\n✅ Database initialized successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

initDB();
