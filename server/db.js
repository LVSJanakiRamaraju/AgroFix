import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config(); // Load .env before using process.env

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false, // For Neon PostgreSQL
  }
});

export default pool;
