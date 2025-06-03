import { relations } from 'drizzle-orm';
import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { business } from './business.schema';
import { friendship } from './friendship.schema';
import { list } from './list.schema';
import { review } from './review.schema';

/* 
      User
        - id
        - name
        - email
        - profilePhotoUrl
        - createdAt
*/

export const user = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    profilePhotoUrl: text('profile_photo_url'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    idIndex: index('idIndex').on(t.id),
  }),
);

export const usersRelations = relations(user, ({ many }) => ({
  review: many(review),
  list: many(list),
  friendship: many(friendship),
  business: many(business),
}));
