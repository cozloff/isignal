import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const business = pgTable('business', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  employeeId: integer('employeeId')
    .references(() => users.id)
    .notNull(),
});

export const businessRelations = relations(business, ({ one, many }) => ({
  employee: one(users, {
    fields: [business.employeeId],
    references: [users.id],
  }),
}));
