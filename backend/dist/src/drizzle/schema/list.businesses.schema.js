"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBusinessesRelations = exports.listBusinesses = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const list_schema_1 = require("./list.schema");
const business_schema_1 = require("./business.schema");
exports.listBusinesses = (0, pg_core_1.pgTable)('list_businesses', {
    listId: (0, pg_core_1.integer)('list_id')
        .references(() => list_schema_1.list.id)
        .notNull(),
    businessId: (0, pg_core_1.integer)('business_id')
        .references(() => business_schema_1.business.id)
        .notNull(),
}, (t) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [t.listId, t.businessId] }),
}));
exports.listBusinessesRelations = (0, drizzle_orm_1.relations)(exports.listBusinesses, ({ one }) => ({
    list: one(list_schema_1.list, { fields: [exports.listBusinesses.listId], references: [list_schema_1.list.id] }),
    business: one(business_schema_1.business, {
        fields: [exports.listBusinesses.businessId],
        references: [business_schema_1.business.id],
    }),
}));
//# sourceMappingURL=list.businesses.schema.js.map