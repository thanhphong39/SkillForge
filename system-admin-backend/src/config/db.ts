import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://bsc_user:bsc_password@localhost:5432/bsc_skillforge',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export async function initDbTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_custom_leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        company_size VARCHAR(100),
        custom_requirements TEXT,
        deal_amount NUMERIC DEFAULT 0,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE system_custom_leads ADD COLUMN IF NOT EXISTS deal_amount NUMERIC DEFAULT 0;
    `);
    console.log('PostgreSQL system_custom_leads table initialized successfully');
  } catch (err) {
    console.error('Failed to init system_custom_leads table:', err);
  }
}
