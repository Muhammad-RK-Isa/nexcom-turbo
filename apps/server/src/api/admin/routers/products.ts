import { insertProductSchema, listProductsSearchSchema } from "@nexcom/validators/admin";
import { createAdminRouter, protectedAdminProcedure } from "../trpc";
import { listProducts } from "../services/products.list";
import { insertProducts } from "../services/products.insert";

export const productsRouter = createAdminRouter({
  list: protectedAdminProcedure
    .input(listProductsSearchSchema)
    .query(async ({ ctx, input }) => listProducts(ctx, input)),
  insert: protectedAdminProcedure
    .input(insertProductSchema)
    .mutation(async ({ ctx, input }) => insertProducts(ctx, input)),
})