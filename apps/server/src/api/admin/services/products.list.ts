import type { ListProductsSearchInput } from "@nexcom/validators/admin"
import type { ProtectedAdminContext } from "../trpc"
import { products, type ProductEntity } from "@nexcom/db/schema"
import { and, asc, count, desc, gte, lte, or, type SQL } from "@nexcom/db"
import { filterColumn } from "@nexcom/db/lib/filter-column"
import type { DrizzleWhere } from "@nexcom/db/types"

export async function listProducts(ctx: ProtectedAdminContext, input: ListProductsSearchInput) {
  try {
    const { page, per_page, sort, title, status, operator, from, to } = input

    const offset = (page - 1) * per_page

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof ProductEntity | undefined, "asc" | "desc" | undefined]

    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      title
        ? filterColumn({
          column: products.title,
          value: title,
        })
        : undefined,
      !!status
        ? filterColumn({
          column: products.status,
          value: status,
          isSelectable: true,
        })
        : undefined,
      fromDay && toDay
        ? and(gte(products.createdAt, fromDay), lte(products.createdAt, toDay), )
        : undefined,
    ]
    const where: DrizzleWhere<ProductEntity> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    const { data, total } = await ctx.db.transaction(async (tx) => {
      const productRows = await tx
        .select()
        .from(products)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.id)
        )

      const productImages = await tx.query.productsImages.findMany({
        where: (t, { inArray, and, eq }) =>
          and(
            inArray(
              t.productId,
              productRows.map(({ id }) => id)
            ),
            eq(t.rank, 0)
          ),
        with: {
          image: true,
        },
      })

      const data = productRows.map((product) => ({
        ...product,
        thumbnailImage: productImages.find(
          ({ productId }) => productId === product.id
        )?.image,
      }))

      const total = await tx
        .select({
          count: count(),
        })
        .from(products)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return {
      data,
      pageCount,
    }
  } catch (e) {
    return { data: [], pageCount: 0 }
  }
}