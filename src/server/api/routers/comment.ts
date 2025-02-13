import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { sanitizeEmail } from "@/server/auth/utils";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(4),
        postId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(
        input,
        "=========================================================input comm=========================",
      );
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });
      if (!post) {
        throw new Error("Post does not exist");
      }
      return ctx.db.comment.create({
        data: {
          name: input.name,
          email: sanitizeEmail(input.email),
          message: input.message,
          approved: false,
          postId: input.postId,
        },
      });
    }),
  // GET ALL APPROVED BY ID
  getApproved: publicProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId, approved: true },
        orderBy: { createdAt: "desc" },
      });
    }),
  // GET ALL COMMENTS BY ROLE
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (
      ctx.session?.user?.role !== "ADMIN" &&
      ctx.session?.user?.role !== "EDITOR"
    ) {
      throw new Error("You do not have permission to view all comments.");
    }
    return ctx.db.comment.findMany();
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findUnique({
        where: { id: input.id },
      });
    }),
  approve: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });
      if (!comment) {
        throw new Error("Comment not found.");
      }
      if (
        ctx.session?.user?.role !== "ADMIN" &&
        ctx.session?.user?.role !== "EDITOR"
      ) {
        throw new Error("You do not have permission to approve this comment.");
      }
      return ctx.db.comment.update({
        where: { id: input.id },
        data: { approved: true },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });
      if (!comment) {
        throw new Error("Comment not found.");
      }
      if (
        ctx.session?.user?.role !== "ADMIN" &&
        ctx.session?.user?.role !== "EDITOR"
      ) {
        throw new Error("You do not have permission to delete this comment.");
      }
      return ctx.db.comment.delete({
        where: { id: input.id },
      });
    }),
  incraseLikes: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const currentLikeNumber = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });
      if (currentLikeNumber === null) {
        throw new Error("Comment not found.");
      }
      // E OK, DAR ARE EROARE---- MERGE
      return await ctx.db.comment.update({
        where: { id: input.id },
        data: { likes: currentLikeNumber.likes + 1 },
      });
    }),

  decreaseLikes: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const currentLikeNumber = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });
      if (currentLikeNumber === null) {
        throw new Error("Comment not found.");
      }
      return await ctx.db.comment.update({
        where: { id: input.id },
        data: { likes: currentLikeNumber.likes - 1 },
      });
    }),
});
