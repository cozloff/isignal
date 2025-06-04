"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipRelations = exports.friendship = exports.friendshipStatusEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
exports.friendshipStatusEnum = (0, pg_core_1.pgEnum)('friendship_status', [
    'pending',
    'accepted',
    'blocked',
]);
exports.friendship = (0, pg_core_1.pgTable)('friendship', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id')
        .references(() => user_schema_1.user.id)
        .notNull(),
    friendId: (0, pg_core_1.integer)('friend_id')
        .references(() => user_schema_1.user.id)
        .notNull(),
    status: (0, exports.friendshipStatusEnum)('status').default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.friendshipRelations = (0, drizzle_orm_1.relations)(exports.friendship, ({ one }) => ({
    user: one(user_schema_1.user, { fields: [exports.friendship.userId], references: [user_schema_1.user.id] }),
    friend: one(user_schema_1.user, {
        fields: [exports.friendship.friendId],
        references: [user_schema_1.user.id],
    }),
}));
//# sourceMappingURL=friendship.schema.js.map