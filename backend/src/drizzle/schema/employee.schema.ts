import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { business } from './business.schema';
import { position } from './position.schema';
import { user } from './user.schema';

/*
            Employee
                - id
                - businessId → [Business]
                - userId → [User]
                - positionId → [Position]
                - createdAt
*/

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id')
    .references(() => business.id)
    .notNull(),
  userId: integer('user_id').references(() => user.id),
  positionId: integer('position_id').references(() => position.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const employeeRelations = relations(employee, ({ one }) => ({
  business: one(business, {
    fields: [employee.businessId],
    references: [business.id],
  }),
  user: one(user, { fields: [employee.userId], references: [user.id] }),
  position: one(position, {
    fields: [employee.positionId],
    references: [position.id],
  }),
}));
