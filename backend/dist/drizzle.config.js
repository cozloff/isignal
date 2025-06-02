"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const drizzle_kit_1 = require("drizzle-kit");
dotenv_1.default.config({ path: '.env.local' });
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/drizzle/schema/**.schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
//# sourceMappingURL=drizzle.config.js.map