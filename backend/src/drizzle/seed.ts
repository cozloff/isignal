import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/schema';
import 'dotenv/config';
import { faker } from '@faker-js/faker';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
  const userIds = await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const user = await db
          .insert(schema.users)
          .values({
            email: faker.internet.email(),
            name: faker.person.firstName() + ' ' + faker.person.lastName(),
          })
          .returning();
        return user[0].id;
      }),
  );

  await Promise.all(
    Array(50)
      .fill('')
      .map(async () => {
        const post = await db
          .insert(schema.business)
          .values({
            name: faker.company.name(),
            employeeId: faker.helpers.arrayElement(userIds),
          })
          .returning();
        return post[0].id;
      }),
  );
}

main()
  .then()
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
