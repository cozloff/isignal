import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.schema';
import { business } from './business.schema';

/*
            Review
                - id
                - businessId → [Business]
                - userId → [User]
                - stars
                - comment
                - reviewPhotoUrl
                - createdAt
*/

export const review = pgTable('review', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .references(() => business.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  stars: integer('stars').notNull(),
  comment: text('comment'),
  reviewPhotoUrl: text('review_photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviewsRelations = relations(review, ({ one }) => ({
  business: one(business, {
    fields: [review.businessId],
    references: [business.id],
  }),
  user: one(user, { fields: [review.userId], references: [user.id] }),
}));
