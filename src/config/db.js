import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;


const dbConfig = {
  host: process.env.DB_HOST || 'fosan.id',
  port: process.env.DB_PORT || 8687,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Tr!quetra2025',
  connectionTimeoutMillis: 5000, 
  query_timeout: 10000,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

pool.query('SELECT NOW()')
  .then(res => {
    console.log('Database connected successfully at:', res.rows[0].now);
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    console.warn('Check with database administrator to ensure:');
    console.warn('1. Your IP address (149.129.240.254) is allowed in pg_hba.conf');
    console.warn('2. The database is configured to accept remote connections');
    console.warn('3. The correct SSL/TLS settings are configured');
  });

export default pool;