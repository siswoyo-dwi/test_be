import 'dotenv/config'
import pg from 'pg';


const { Pool } = pg
const client = new Pool({
    //  host: process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB,
    // max: 20, 
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000
    connectionString: `postgres://postgres:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}?sslmode=require`,
    ssl: {
        rejectUnauthorized: false
      },
  
  })
export default client
