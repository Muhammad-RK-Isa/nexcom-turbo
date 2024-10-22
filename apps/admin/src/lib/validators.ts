import { fallback } from "@tanstack/router-zod-adapter";
import { z } from "zod";

export const authRouteSearchSchema = z.object({
  callbackUrl: fallback(z.string(), "/").default("/"),
})