"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRelations = exports.business = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
const review_schema_1 = require("./review.schema");
const employee_schema_1 = require("./employee.schema");
const service_schema_1 = require("./service.schema");
const location_schema_1 = require("./location.schema");
exports.business = (0, pg_core_1.pgTable)('business', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    category: (0, pg_core_1.varchar)('category', { length: 255 }),
    registrationStatus: (0, pg_core_1.varchar)('registration_status', { length: 255 }),
    ownerId: (0, pg_core_1.integer)('ownerId')
        .references(() => user_schema_1.user.id)
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.businessRelations = (0, drizzle_orm_1.relations)(exports.business, ({ many, one }) => ({
    user: one(user_schema_1.user, { fields: [exports.business.ownerId], references: [user_schema_1.user.id] }),
    review: many(review_schema_1.review),
    employee: many(employee_schema_1.employee),
    service: many(service_schema_1.service),
    location: one(location_schema_1.location),
}));
//# sourceMappingURL=business.schema.js.map