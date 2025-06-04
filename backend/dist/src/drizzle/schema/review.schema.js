"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsRelations = exports.review = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
const business_schema_1 = require("./business.schema");
exports.review = (0, pg_core_1.pgTable)('review', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    businessId: (0, pg_core_1.integer)('business_id')
        .references(() => business_schema_1.business.id)
        .notNull(),
    userId: (0, pg_core_1.integer)('user_id')
        .references(() => user_schema_1.user.id)
        .notNull(),
    stars: (0, pg_core_1.integer)('stars').notNull(),
    comment: (0, pg_core_1.text)('comment'),
    reviewPhotoUrl: (0, pg_core_1.text)('review_photo_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.reviewsRelations = (0, drizzle_orm_1.relations)(exports.review, ({ one }) => ({
    business: one(business_schema_1.business, {
        fields: [exports.review.businessId],
        references: [business_schema_1.business.id],
    }),
    user: one(user_schema_1.user, { fields: [exports.review.userId], references: [user_schema_1.user.id] }),
}));
//# sourceMappingURL=review.schema.js.map