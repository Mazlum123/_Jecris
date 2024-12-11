import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const [credentials, host] = connectionString.split('@');
const [user, password] = credentials.split(':');
const [hostname, port] = host.split(':');
const database = hostname.split('/')[1];

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: hostname,
    port: parseInt(port),
    user: user.replace('postgres://', ''),
    password: password,
    database: database,
  },
} satisfies Config;