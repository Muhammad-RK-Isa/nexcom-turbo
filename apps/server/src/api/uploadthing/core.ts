import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";
import { getUser } from "../../auth/get-user";
import { env } from "../../env";

const f = createUploadthing();

export const fileUploadRouter = {
  authenticatedImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).middleware(async ({ req, }) => {
    const cookie = req.headers.get("Cookie") ?? "";
    const { user, session } = await getUser(cookie);
    if (!user || !session) throw new UploadThingError({
      code: "FORBIDDEN",
      message: "You are not allowed to perform this action",
    })
    return { user };
  }).onUploadComplete(({ file, metadata: { user } }) => {
    if (env.NODE_ENV !== "production") {
      console.log("✅ Upload completed")
      console.log(`✅ Uploade completed by ${user.name}`)
      console.log("🔗 File url", file.url)
    }
    return { file }
  }),
  adminImageUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 100,
    },
  }).middleware(async ({ req, }) => {
    const cookie = req.headers.get("Cookie") ?? "";
    const { user, session } = await getUser(cookie);
    if (!user || !session || user.role !== "admin") throw new UploadThingError({
      code: "FORBIDDEN",
      message: "You are not allowed to perform this action",
      cause: "Non-admin access",
    })
    return { user };
  }).onUploadComplete(({ file, metadata: { user } }) => {
    if (env.NODE_ENV !== "production") {
      console.log("✅ Upload completed")
      console.log(`✅ Uploade completed by ${user.name}`)
      console.log("🔗 File url", file.url)
    }
    return { file }
  }),
} satisfies FileRouter;

export type FileUploadRouter = typeof fileUploadRouter;
