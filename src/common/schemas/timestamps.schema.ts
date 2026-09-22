import { timestamp } from 'drizzle-orm/pg-core';

export const timestampsSchema = {
  updatedAt: timestamp('updatedAt').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow(),
  // deletedAt: timestamp('deletedAt'),
};
