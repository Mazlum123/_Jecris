import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

// Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: text('price').notNull(),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations avec corrections explicites
export const usersRelations = relations(users, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(users, {
    fields: [books.authorId],
    references: [users.id],
  }),
}));
