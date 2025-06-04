"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRelations = exports.list = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
const list_businesses_schema_1 = require("./list.businesses.schema");
exports.list = (0, pg_core_1.pgTable)('list', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id')
        .references(() => user_schema_1.user.id)
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
});
exports.listRelations = (0, drizzle_orm_1.relations)(exports.list, ({ many }) => ({
    businesses: many(list_businesses_schema_1.listBusinesses),
}));
//# sourceMappingURL=list.schema.js.map