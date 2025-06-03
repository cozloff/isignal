import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { listBusinesses } from './list.businesses.schema';

/*
            List
                - id
                - userId → [User]
                - name
*/

export const list = pgTable('list', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  name: text('name').notNull(),
});

export const listRelations = relations(list, ({ many }) => ({
  businesses: many(listBusinesses),
}));
