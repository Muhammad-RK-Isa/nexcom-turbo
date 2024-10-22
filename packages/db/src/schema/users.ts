import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { generateId, lifecycleDates } from "../lib/utils";

export const pgUserRoles = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId()),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    avatar: text("avatar"),
    password: varchar("password", { length: 255 }),
    role: pgUserRoles("role").notNull().default("user"),
    ...lifecycleDates,
  },
  (t) => ({
    nameIdx: index("name_idx").on(t.name),
    emailIdx: uniqueIndex("email_idx").on(t.email),
  }),
);

export type UserEntity = typeof users.$inferSelect;
