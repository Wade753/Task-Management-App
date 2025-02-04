import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  //ADD POST TO DB
  create: publicProcedure //protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(10) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          published: true,
          // createdBy: { connect: { id: ctx.session.user.id } },
          createdBy: { connect: { id: "1" } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),
  //GET ALL POSTS
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany();

    // {
    //   orderBy: { createdAt: "desc" },
    //   where: { createdById: "1" },
    // }

    // return post ?? [];
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
