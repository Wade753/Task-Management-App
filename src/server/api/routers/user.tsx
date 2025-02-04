import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { hashPassword, sanitizeEmail } from "@/server/auth/utils";

export const userRouter = createTRPCRouter({                                 // formezi ruta catre create user Ruta pe care o pui si in root.ts.
    create: publicProcedure
        .input(z.object({ name: z.string().min(1), email: z.string().min(1), password: z.string().min(4) }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.create({
                data: {
                    name: input.name,
                    email: sanitizeEmail(input.email),
                    password: await hashPassword(input.password),
                    role: "WRITER",
                },
            });
        }),
});
