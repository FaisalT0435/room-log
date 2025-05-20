import { createPool, Pool } from 'mysql2/promise';

let pool: Pool;
export function getDB(): Pool {
  if (!pool) {
    pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
}