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
      .fill(null)
      .map(async () => {
        const [user] = await db
          .insert(schema.user)
          .values({
            email: faker.internet.email(),
            name: faker.person.firstName() + ' ' + faker.person.lastName(),
            profilePhotoUrl: faker.image.avatar(),
            createdAt: new Date(),
          })
          .returning();
        return user.id;
      }),
  );

  const businessIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [business] = await db
          .insert(schema.business)
          .values({
            name: faker.company.name(),
            category: faker.commerce.department(),
            registrationStatus: faker.helpers.arrayElement([
              'pending',
              'accepted',
              'declined',
            ]),
            ownerId: faker.helpers.arrayElement(userIds),
            createdAt: new Date(),
          })
          .returning({ id: schema.business.id });
        return business.id;
      }),
  );

  const positionIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [position] = await db
          .insert(schema.position)
          .values({
            title: faker.person.jobTitle(),
            description: faker.person.jobDescriptor(),
          })
          .returning({ id: schema.position.id });
        return position.id;
      }),
  );

  const employeeIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [employee] = await db
          .insert(schema.employee)
          .values({
            businessId: faker.helpers.arrayElement(businessIds),
            userId: faker.helpers.arrayElement(userIds),
            positionId: faker.helpers.arrayElement(positionIds),
            createdAt: new Date(),
          })
          .returning({ id: schema.employee.id });
        return employee.id;
      }),
  );

  const locationIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [location] = await db
          .insert(schema.location)
          .values({
            businessId: faker.helpers.arrayElement(businessIds),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip: faker.location.zipCode(),
            lat: faker.location.latitude(),
            lng: faker.location.longitude(),
          })
          .returning({ id: schema.location.id });
        return location.id;
      }),
  );

  const serviceIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [service] = await db
          .insert(schema.service)
          .values({
            name: faker.company.buzzVerb(),
            description: faker.person.jobDescriptor(),
            category: faker.commerce.department(),
            businessId: faker.helpers.arrayElement(businessIds),
          })
          .returning({ id: schema.service.id });
        return service.id;
      }),
  );

  const reviewIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [review] = await db
          .insert(schema.review)
          .values({
            businessId: faker.helpers.arrayElement(businessIds),
            userId: faker.helpers.arrayElement(userIds),
            stars: faker.number.int({ min: 1, max: 5 }),
            comment: faker.lorem.sentence(),
            reviewPhotoUrl: faker.image.urlPicsumPhotos({
              width: 640,
              height: 480,
            }),
            createdAt: new Date(),
          })
          .returning({ id: schema.review.id });
        return review.id;
      }),
  );

  const listIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const [list] = await db
          .insert(schema.list)
          .values({
            userId: faker.helpers.arrayElement(userIds),
            name: faker.word.words({ count: { min: 2, max: 4 } }),
          })
          .returning({ id: schema.list.id });
        return list.id;
      }),
  );

  await Promise.all(
    Array(50)
      .fill(null)
      .map(() => {
        db.insert(schema.listBusinesses).values({
          listId: faker.helpers.arrayElement(listIds),
          businessId: faker.helpers.arrayElement(businessIds),
        });
      }),
  );

  const friendshipIds = await Promise.all(
    Array(50)
      .fill(null)
      .map(async () => {
        const userA = faker.helpers.arrayElement(userIds);
        let userB = faker.helpers.arrayElement(userIds);

        // Ensure a user doesn't friend themselves
        while (userB === userA) {
          userB = faker.helpers.arrayElement(userIds);
        }

        const [friendship] = await db
          .insert(schema.friendship)
          .values({
            userId: userA,
            friendId: userB,
            status: faker.helpers.arrayElement([
              'pending',
              'accepted',
              'blocked',
            ]),
            createdAt: new Date(),
          })
          .returning({ id: schema.friendship.id });

        return friendship.id;
      }),
  );
}

main()
  .then()
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
