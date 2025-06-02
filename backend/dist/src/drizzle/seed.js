"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("./schema/schema");
require("dotenv/config");
const faker_1 = require("@faker-js/faker");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});
const db = (0, node_postgres_1.drizzle)(pool, { schema });
async function main() {
    const userIds = await Promise.all(Array(50)
        .fill('')
        .map(async () => {
        const user = await db
            .insert(schema.users)
            .values({
            email: faker_1.faker.internet.email(),
            name: faker_1.faker.person.firstName() + ' ' + faker_1.faker.person.lastName(),
        })
            .returning();
        return user[0].id;
    }));
    await Promise.all(Array(50)
        .fill('')
        .map(async () => {
        const post = await db
            .insert(schema.business)
            .values({
            name: faker_1.faker.company.name(),
            employeeId: faker_1.faker.helpers.arrayElement(userIds),
        })
            .returning();
        return post[0].id;
    }));
}
main()
    .then()
    .catch((err) => {
    console.error(err);
    process.exit(0);
});
//# sourceMappingURL=seed.js.map