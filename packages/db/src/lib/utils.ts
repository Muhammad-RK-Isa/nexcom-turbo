import {
  timestamp,
} from "drizzle-orm/pg-core"
import { PostgresError } from "postgres"
import { v1 as uuidv1, v4 as uuidv4 } from "uuid"

export function generateId({ prefix }: { prefix?: string } = {}) {
  return `${prefix ? prefix + "_" : ""}${uuidv4()}`
}

export function generateOrderId(): string {
  const timestamp = uuidv1()
  const randomPart = uuidv4()

  const timestampPart = timestamp.split("-")[0]
  const randomPartSegment = randomPart.split("-")[1]

  const orderId = `ORDER-${timestampPart}-${randomPartSegment}`.toUpperCase()
  return orderId
}

export const lifecycleDates = {
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdate(() => new Date()),
}


export function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "severity" in error &&
    "detail" in error
  )
}

