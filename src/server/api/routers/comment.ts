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
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.comment.create({
                data: {
                    name: input.name,
                    email: sanitizeEmail(input.email),
                    message: input.message,
                    approved: false,
                },
            });
        }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.comment.findMany();
    }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.comment.findUnique({
                where: {
                    id: parseInt(input.id, 10),
                },
            });
        }),

        approve: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });

      if (!comment) {
        throw new Error("Comentariul nu a fost găsit.");
      }

      if (ctx.session?.user?.role !== "ADMIN" && ctx.session?.user?.role !== "EDITOR") {
        throw new Error("Nu aveți permisiuni pentru a aproba acest comentariu.");
      }

      return ctx.db.comment.update({
        where: { id: input.id },
        data: { approved: true },
      });
    }),

 
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
      });

      if (!comment) {
        throw new Error("Comentariul nu a fost găsit.");
      }

      if (ctx.session?.user?.role !== "ADMIN") {
        throw new Error("Nu aveți permisiuni pentru a șterge acest comentariu.");
      }

      return ctx.db.comment.update({
        where: { id: input.id },
        data: { deleted: true }, 
      });
    }),
});