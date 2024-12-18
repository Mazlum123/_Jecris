import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDb = async () => {
  await client.connect();
  console.log('Database connected successfully');
  return drizzle(client, { schema });
};

export let db: ReturnType<typeof connectDb> extends Promise<infer T> ? T : never;

// Initialize db
(async () => {
  db = await connectDb();
})();