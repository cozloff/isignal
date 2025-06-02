import { relations } from 'drizzle-orm';
import { index, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { business } from './business.schema';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (t) => ({
    idIndex: index('idIndex').on(t.id),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  business: many(business),
}));
