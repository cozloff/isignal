"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessRelations = exports.business = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users.schema");
exports.business = (0, pg_core_1.pgTable)('business', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    employeeId: (0, pg_core_1.integer)('employeeId')
        .references(() => users_schema_1.users.id)
        .notNull(),
});
exports.businessRelations = (0, drizzle_orm_1.relations)(exports.business, ({ one, many }) => ({
    employee: one(users_schema_1.users, {
        fields: [exports.business.employeeId],
        references: [users_schema_1.users.id],
    }),
}));
//# sourceMappingURL=business.schema.js.map