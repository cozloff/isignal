"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.position = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.position = (0, pg_core_1.pgTable)('position', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.text)('title'),
    description: (0, pg_core_1.text)('description'),
});
//# sourceMappingURL=position.schema.js.map