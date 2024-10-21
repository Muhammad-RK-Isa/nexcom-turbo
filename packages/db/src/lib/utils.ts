import { timestamp } from "drizzle-orm/pg-core";
import { v4 } from "uuid";

export function generateId() {
  return v4();
}

export const lifecycleDates = {
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .$onUpdateFn(() => new Date()),
};
