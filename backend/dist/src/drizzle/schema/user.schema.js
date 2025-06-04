"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.user = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const business_schema_1 = require("./business.schema");
const friendship_schema_1 = require("./friendship.schema");
const list_schema_1 = require("./list.schema");
const review_schema_1 = require("./review.schema");
exports.user = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    profilePhotoUrl: (0, pg_core_1.text)('profile_photo_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
}, (t) => ({
    idIndex: (0, pg_core_1.index)('idIndex').on(t.id),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.user, ({ many }) => ({
    review: many(review_schema_1.review),
    list: many(list_schema_1.list),
    friendship: many(friendship_schema_1.friendship),
    business: many(business_schema_1.business),
}));
//# sourceMappingURL=user.schema.js.map