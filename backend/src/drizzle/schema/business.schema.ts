import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { review } from './review.schema';
import { employee } from './employee.schema';
import { service } from './service.schema';
import { location } from './location.schema';

/*
      Business
        - id
        - name
        - category
        - Registration Status  (`pending`, `accepted`, `declined`)
        - userId (owner) → [User]
        - createdAt
*/

export const business = pgTable('business', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: varchar('category', { length: 255 }),
  registrationStatus: varchar('registration_status', { length: 255 }),
  ownerId: integer('ownerId')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const businessRelations = relations(business, ({ many, one }) => ({
  user: one(user, { fields: [business.ownerId], references: [user.id] }),
  review: many(review),
  employee: many(employee),
  service: many(service),
  location: one(location),
}));
