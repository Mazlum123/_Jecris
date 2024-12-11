import { pgTable, uuid, varchar, decimal } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: varchar('description'),
});