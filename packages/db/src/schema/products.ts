import { index, jsonb, pgEnum, pgTable, real, text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { generateId, lifecycleDates } from "../lib/utils"
import { JSONContent } from "novel"
import { relations, sql } from "drizzle-orm"
import { productOptions } from "./product-options"
import { productVariants } from "./product-variants"
import { productsImages } from "./products-images"

export const pgProductStatuses = pgEnum("productStatuses", ["active", "draft"])

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "product" })),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: jsonb("description").$type<JSONContent>(),
    metaDescription: text("meta_description").notNull(),
    status: pgProductStatuses("status").default("draft").notNull(),
    vendor: text("vendor"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    ...lifecycleDates,
  },
  (t) => ({
    titleIdx: index("title_index").on(t.title),
    slugIdx: uniqueIndex("slug_unique_index").on(t.slug),
  })
)

export const productsRelations = relations(products, ({ many }) => ({
  options: many(productOptions),
  variants: many(productVariants),
  productImages: many(productsImages),
}))

export type ProductEntity = typeof products.$inferSelect