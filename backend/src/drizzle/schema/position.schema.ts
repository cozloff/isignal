import { pgTable, serial, text } from 'drizzle-orm/pg-core';

/*
            Position
                - id
                - title
                - description
*/

export const position = pgTable('position', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
});
