import { eq } from 'drizzle-orm';
import z from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { users } from '~/server/db/schema';

export const userRouter = createTRPCRouter({
    getUserById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        return (await ctx.db.select().from(users).where(eq(users.id, input.id)))[0];
    }),
});
