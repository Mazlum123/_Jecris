import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the .env file');
}

// Analyse les parties de la chaîne de connexion
const [credentials, hostWithPortAndDb] = connectionString.split('@');
const [user, password] = credentials.replace('postgres://', '').split(':');
const [hostWithPort, database] = hostWithPortAndDb.split('/');
const [hostname, port] = hostWithPort.split(':');

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: hostname,
    port: parseInt(port, 10),
    user,
    password,
    database,
  },
} satisfies Config;
