import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { list } from './list.schema';
import { business } from './business.schema';

/*
            ListBusinesses
                - composite id
                - list → [List]
                - businesses → [Business]
*/

export const listBusinesses = pgTable(
  'list_businesses',
  {
    listId: integer('list_id')
      .references(() => list.id)
      .notNull(),
    businessId: integer('business_id')
      .references(() => business.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.listId, t.businessId] }),
  }),
);

export const listBusinessesRelations = relations(listBusinesses, ({ one }) => ({
  list: one(list, { fields: [listBusinesses.listId], references: [list.id] }),
  business: one(business, {
    fields: [listBusinesses.businessId],
    references: [business.id],
  }),
}));
