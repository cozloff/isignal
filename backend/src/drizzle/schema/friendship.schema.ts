import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user.schema';

/*           
           Friendship
                - id
                - userId → [User]
                - friendId → [User]
                - status (`pending`, `accepted`, `blocked`)
                - createdAt
*/

export const friendshipStatusEnum = pgEnum('friendship_status', [
  'pending',
  'accepted',
  'blocked',
]);

export const friendship = pgTable('friendship', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  friendId: integer('friend_id')
    .references(() => user.id)
    .notNull(),
  status: friendshipStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const friendshipRelations = relations(friendship, ({ one }) => ({
  user: one(user, { fields: [friendship.userId], references: [user.id] }),
  friend: one(user, {
    fields: [friendship.friendId],
    references: [user.id],
  }),
}));
