import { TRPCError } from '@trpc/server';
import { sql } from 'drizzle-orm';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import type { Alt1Config } from '~/lib/alt1';
import { getAppConfigs, getUserRepos, type GithubRepositoryInfo } from '~/lib/github';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { votes } from '~/server/db/schema';

export const voteManagementRouter = createTRPCRouter({
    upvote: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        // console.log(ctx.headers, ctx.session)
        await ctx.db
            .insert(votes)
            .values({
                createdById: ctx.session.user.id,
                pluginId: input,
                value: 1,
            })
            .onConflictDoUpdate({
                target: [votes.createdById, votes.pluginId],
                set: { value: 1 },
            });
        return;
    }),
    downvote: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
        // console.log(ctx.headers, ctx.session)
        await ctx.db
            .insert(votes)
            .values({
                createdById: ctx.session.user.id,
                pluginId: input,
                value: -1,
            })
            .onConflictDoUpdate({
                target: [votes.createdById, votes.pluginId],
                set: { value: -1 },
            });
        return;
    }),
    getVotes: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        // console.log(ctx.headers, ctx.session)
        return await ctx.db
            .select({
                pluginId: votes.pluginId,
                upvotes: sql<number>`SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END)`,
                downvotes: sql<number>`SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END)`,
                total: sql<number>`SUM(${votes.value})`,
            })
            .from(votes)
            .where(sql`${votes.pluginId} = ${input}`)
            .groupBy(votes.pluginId);
    }),
});
