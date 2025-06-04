"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.location = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const business_schema_1 = require("./business.schema");
exports.location = (0, pg_core_1.pgTable)('location', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    businessId: (0, pg_core_1.integer)('business_id').references(() => business_schema_1.business.id),
    address: (0, pg_core_1.text)('address'),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 100 }),
    zip: (0, pg_core_1.varchar)('zip', { length: 20 }),
    lat: (0, pg_core_1.doublePrecision)('lat'),
    lng: (0, pg_core_1.doublePrecision)('lng'),
});
//# sourceMappingURL=location.schema.js.map