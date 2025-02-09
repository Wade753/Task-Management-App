import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { hashPassword, sanitizeEmail } from "@/server/auth/utils";

export const userRouter = createTRPCRouter({
  // formezi ruta catre create user Ruta pe care o pui si in root.ts.
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(4),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userExistis = await ctx.db.user.findFirst({
        where: {
          email: sanitizeEmail(input.email),
        },
      });
      if (userExistis) {
        throw new Error("User already exists");
      }

      return ctx.db.user.create({
        data: {
          name: input.name,
          email: sanitizeEmail(input.email),
          password: await hashPassword(input.password),
          role: "WRITER",
        },
      });
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, newPassword } = input;

      // Verifică dacă utilizatorul există
      const user = await ctx.db.user.findUnique({
        where: { email: sanitizeEmail(email) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Actualizează parola utilizatorului
      return ctx.db.user.update({
        where: { email: sanitizeEmail(email) },
        data: { password: await hashPassword(newPassword) },
      });
    }),
});
