import { createRouteHandler } from "uploadthing/server";

import { env } from "../../env.ts";
import { fileUploadRouter } from "./core.ts";

export const handlers = createRouteHandler({
  router: fileUploadRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});