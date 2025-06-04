"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRelations = exports.employee = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const business_schema_1 = require("./business.schema");
const position_schema_1 = require("./position.schema");
const user_schema_1 = require("./user.schema");
exports.employee = (0, pg_core_1.pgTable)('employee', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    businessId: (0, pg_core_1.integer)('business_id')
        .references(() => business_schema_1.business.id)
        .notNull(),
    userId: (0, pg_core_1.integer)('user_id').references(() => user_schema_1.user.id),
    positionId: (0, pg_core_1.integer)('position_id').references(() => position_schema_1.position.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.employeeRelations = (0, drizzle_orm_1.relations)(exports.employee, ({ one }) => ({
    business: one(business_schema_1.business, {
        fields: [exports.employee.businessId],
        references: [business_schema_1.business.id],
    }),
    user: one(user_schema_1.user, { fields: [exports.employee.userId], references: [user_schema_1.user.id] }),
    position: one(position_schema_1.position, {
        fields: [exports.employee.positionId],
        references: [position_schema_1.position.id],
    }),
}));
//# sourceMappingURL=employee.schema.js.map