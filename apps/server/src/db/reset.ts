import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function reset() {
  const db = drizzle(pool);

  try {
    // Suppression des tables existantes
    await pool.query(`
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS books CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('Tables supprimées avec succès');

    // Migration des nouvelles tables
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration réussie !');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation :', error);
  } finally {
    await pool.end();
  }
}

reset();