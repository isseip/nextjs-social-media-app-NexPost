import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new Error("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("onUploadComplete: Metadata:", metadata);
      console.log("onUploadComplete: File details:", file);

      // Update avatar logic
      const newAvatarUrl = file.url;
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl: newAvatarUrl },
      });

      console.log("onUploadComplete: User updated with new avatar URL:", newAvatarUrl);

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new Error("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("onUploadComplete: Attachment upload completed:", file);

      const media = await prisma.media.create({
        data: {
          url: file.url,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      console.log("onUploadComplete: Media record created:", media);

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
