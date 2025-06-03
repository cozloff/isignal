import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { business } from './business.schema';

/*
            Service
                - id
                - businessId → [Businesss]
                - name
                - description
                - category
*/

export const service = pgTable('service', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  businessId: integer('business_id')
    .references(() => business.id)
    .notNull(),
});

export const servicesRelations = relations(service, ({ one }) => ({
  business: one(business, {
    fields: [service.businessId],
    references: [business.id],
  }),
}));
