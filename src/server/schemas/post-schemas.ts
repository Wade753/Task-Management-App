import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  id: z.string().uuid(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  approvedById: z.string().uuid().nullable(),
  editedById: z.string().uuid().nullable(),
  createdById: z.string().uuid(),
});

export type postType = z.infer<typeof postSchema>;
export type extendedPostType = postType & {
  createdBy: { name: string };
  editedBy: { name: string } | null;
  approvedBy: { name: string } | null;
};
