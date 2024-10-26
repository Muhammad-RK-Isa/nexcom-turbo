import { relations } from "drizzle-orm"
import {
  pgTable,
  real,
  varchar,
  boolean,
  integer,
  pgEnum,
  text, } from "drizzle-orm/pg-core"

import { generateId } from "../lib/utils"

import { images } from "./images"
import { products } from "./products"
import { lifecycleDates } from "../lib/utils"
import { variantsOptionValues } from "./variants-option-values"

export const pgWeightUnits = pgEnum("weight_unit", ["kg", "g", "lb", "oz"])
export const pgSizeUnits = pgEnum("pgSize_unit", ["m", "cm", "mm", "in", "ft"])

export const productVariants = pgTable("product_variants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "variant" })),
  title: varchar("title", { length: 255 }),
  productId: varchar("product_id", { length: 255 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageId: varchar("image_id", { length: 255 }).references(() => images.id, {
    onDelete: "set null",
  }),
  mrp: real("mrp").notNull().default(0),
  price: real("price").notNull().default(0),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  allowBackorder: boolean("allow_backorder").notNull().default(false),
  manageInventory: boolean("manage_inventory").notNull().default(false),
  weight: real("weight").notNull(),
  length: real("length"),
  height: real("height"),
  width: real("width"),
  weightUnit: pgWeightUnits("weight_unit").notNull().default("kg"),
  heightUnit: pgSizeUnits("height_unit").notNull().default("m"),
  lengthUnit: pgSizeUnits("length_unit").notNull().default("m"),
  widthUnit: pgSizeUnits("width_unit").notNull().default("m"),
  originCountry: text("origin_country"),
  material: text("material"),
  ...lifecycleDates,
})

export const variantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    image: one(images, {
      fields: [productVariants.imageId],
      references: [images.id],
    }),
    variantsOptionValues: many(variantsOptionValues),
  })
)
