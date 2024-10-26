import { isPostgresError } from "@nexcom/db/lib/utils"
import type { ProtectedAdminContext } from "../trpc"
import type { InsertProductInput } from "@nexcom/validators/admin"
import { productOptions, productOptionValues, products, productsImages, productVariants, variantsOptionValues } from "@nexcom/db/schema"
import { TRPCError } from "@trpc/server"

export async function insertProducts(ctx: ProtectedAdminContext, input: InsertProductInput) {
  try {
    const productWithRelations = await ctx.db.transaction(async (tx) => {
      const [productRecord] = await tx
        .insert(products)
        .values({
          ...input,
          weight: input.weight.value,
          weightUnit: input.weight.unit,
          length: input.length?.value ?? null,
          lengthUnit: input.length?.unit,
          height: input.height?.value ?? null,
          heightUnit: input.height?.unit,
          width: input.width?.value ?? null,
          widthUnit: input.width?.unit,
        })
        .returning()

      if (!productRecord)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create product",
        })

      const productId = productRecord.id

      // Insert product images
      const images = await Promise.all(
        input.images?.map(
          async (image) =>
            await tx
              .insert(productsImages)
              .values({
                imageId: image.id,
                productId,
                rank: input.images?.findIndex((i) => i.id === image.id),
              })
              .returning()
        ) || []
      )

      // Insert options and their values
      const optionsWithValues = await Promise.all(
        input.options.map(async (option) => {
          const [newOption] = await tx
            .insert(productOptions)
            .values({
              id: option.id,
              title: option.title,
              rank: option.rank,
              productId,
            })
            .returning()

          if (!newOption)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Failed to create product option",
            })

          const optionValues = await Promise.all(
            option.values.map(async (value) => {
              const [newValue] = await tx
                .insert(productOptionValues)
                .values({
                  ...value,
                  optionId: newOption.id,
                })
                .returning()
              return newValue
            })
          )

          return {
            ...newOption,
            values: optionValues,
          }
        })
      )

      // Insert variants and their options
      const variantsWithOptions = await Promise.all(
        input.variants.map(async (variant) => {
          const [v] = await tx
            .insert(productVariants)
            .values({
              ...variant,
              productId,
              imageId: variant.image?.id,
              weight: variant.weight?.value,
              weightUnit: variant.weight?.unit,
              length: variant.length?.value,
              lengthUnit: variant.length?.unit,
              height: variant.height?.value,
              heightUnit: variant.height?.unit,
              width: variant.width?.value,
              widthUnit: variant.width?.unit,
            })
            .returning()

          if (!v) throw new Error("Failed to create product variant")

          const variantOptions = await Promise.all(
            variant.options.map(async (option) => {
              const valueId = Object.values(option)[0]
              if (valueId) {
                await tx.insert(variantsOptionValues).values({
                  variantId: v.id,
                  optionValueId: valueId,
                })
              }
              return { optionId: Object.keys(option)[0], valueId }
            })
          )

          return {
            ...v,
            options: variantOptions,
          }
        })
      )

      return {
        ...productRecord,
        images,
        options: optionsWithValues,
        variants: variantsWithOptions,
      }
    })

    return { product: productWithRelations }
  } catch (error) {
    if (isPostgresError(error) && error.code === "23505") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A product with the same slug already exists",
        cause: "DUPLICATE_SLUG",
      })
    }
    throw error
  }
}