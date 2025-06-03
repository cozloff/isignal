import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { business } from './business.schema';

/*
            Location
                - id
                - businessId → [Business]
                - address
                - city
                - state
                - zip
                - lat
                - lng
*/

export const location = pgTable('location', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').references(() => business.id),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zip: varchar('zip', { length: 20 }),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
});
