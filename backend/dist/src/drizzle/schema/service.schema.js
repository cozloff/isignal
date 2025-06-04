"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesRelations = exports.service = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const business_schema_1 = require("./business.schema");
exports.service = (0, pg_core_1.pgTable)('service', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    category: (0, pg_core_1.text)('category'),
    businessId: (0, pg_core_1.integer)('business_id')
        .references(() => business_schema_1.business.id)
        .notNull(),
});
exports.servicesRelations = (0, drizzle_orm_1.relations)(exports.service, ({ one }) => ({
    business: one(business_schema_1.business, {
        fields: [exports.service.businessId],
        references: [business_schema_1.business.id],
    }),
}));
//# sourceMappingURL=service.schema.js.map