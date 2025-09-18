import { TRPCError } from '@trpc/server';
import { desc, eq, gte, sql } from 'drizzle-orm';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import type { Alt1Config } from '~/lib/alt1';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { plugins, votes } from '~/server/db/schema';
import { fetchAlt1Config } from '~/util/fetchAlt1Config';

export const voteManagementRouter = createTRPCRouter({
    manage: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                value: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // console.log(ctx.headers, ctx.session)
            await ctx.db
                .insert(votes)
                .values({
                    createdById: ctx.session.user.id,
                    pluginId: input.id,
                    value: input.value,
                })
                .onConflictDoUpdate({
                    target: [votes.createdById, votes.pluginId],
                    set: { value: input.value },
                });
            return;
        }),
    getVotes: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        // console.log(ctx.headers, ctx.session)
        return (
            await ctx.db
                .select({
                    pluginId: plugins.id,
                    name: plugins.name,
                    appConfig: plugins.appConfig,
                    upvotes: sql<number>`SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END)`,
                    downvotes: sql<number>`SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END)`,
                    total: sql<number>`SUM(${votes.value})`,
                    userVote: ctx.session?.user.id
                        ? sql<
                              number | null
                          >`MAX(CASE WHEN ${votes.createdById} = ${ctx.session?.user.id} THEN ${votes.value} ELSE NULL END)`
                        : sql<number | null>`NULL`,
                })
                .from(plugins)
                .leftJoin(votes, eq(votes.pluginId, plugins.id))
                .where(eq(plugins.id, input))
                .groupBy(plugins.id, plugins.name, plugins.appConfig)
        )[0];
    }),
    getTopVoted: publicProcedure.query(async ({ ctx }) => {
        const [dailyTop, weeklyTop, monthlyTop] = await Promise.all([
            // Daily top
            ctx.db
                .select({
                    pluginId: plugins.id,
                    name: plugins.name,
                    appConfig: plugins.appConfig,
                    upvotes: sql<number>`SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END)`,
                    downvotes: sql<number>`SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END)`,
                    total: sql<number>`SUM(${votes.value})`,
                    userVote: ctx.session?.user.id
                        ? sql<
                              number | null
                          >`MAX(CASE WHEN ${votes.createdById} = ${ctx.session?.user.id} THEN ${votes.value} ELSE NULL END)`
                        : sql<number | null>`NULL`,
                })
                .from(plugins)
                .leftJoin(votes, eq(votes.pluginId, plugins.id))
                .where(gte(votes.createdAt, sql`NOW() - INTERVAL '1 day'`))
                .groupBy(plugins.id, plugins.name, plugins.appConfig)
                .orderBy(desc(sql`SUM(${votes.value})`))
                .limit(1),

            // Weekly top
            ctx.db
                .select({
                    pluginId: plugins.id,
                    name: plugins.name,
                    appConfig: plugins.appConfig,
                    upvotes: sql<number>`SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END)`,
                    downvotes: sql<number>`SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END)`,
                    total: sql<number>`SUM(${votes.value})`,
                    userVote: ctx.session?.user.id
                        ? sql<
                              number | null
                          >`MAX(CASE WHEN ${votes.createdById} = ${ctx.session?.user.id} THEN ${votes.value} ELSE NULL END)`
                        : sql<number | null>`NULL`,
                })
                .from(plugins)
                .leftJoin(votes, eq(votes.pluginId, plugins.id))
                .where(gte(votes.createdAt, sql`NOW() - INTERVAL '7 days'`))
                .groupBy(plugins.id, plugins.name, plugins.appConfig)
                .orderBy(desc(sql`SUM(${votes.value})`))
                .limit(1),

            // Monthly top
            ctx.db
                .select({
                    pluginId: plugins.id,
                    name: plugins.name,
                    appConfig: plugins.appConfig,
                    upvotes: sql<number>`SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END)`,
                    downvotes: sql<number>`SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END)`,
                    total: sql<number>`SUM(${votes.value})`,
                    userVote: ctx.session?.user.id
                        ? sql<
                              number | null
                          >`MAX(CASE WHEN ${votes.createdById} = ${ctx.session?.user.id} THEN ${votes.value} ELSE NULL END)`
                        : sql<number | null>`NULL`,
                })
                .from(plugins)
                .leftJoin(votes, eq(votes.pluginId, plugins.id))
                .where(gte(votes.createdAt, sql`NOW() - INTERVAL '30 days'`))
                .groupBy(plugins.id, plugins.name, plugins.appConfig)
                .orderBy(desc(sql`SUM(${votes.value})`))
                .limit(1),
        ]);

        // Fetch Alt1Config JSON in parallel
        const [dailyConfig, weeklyConfig, monthlyConfig] = await Promise.all([
            dailyTop[0]?.appConfig ? fetchAlt1Config(dailyTop[0].appConfig) : null,
            weeklyTop[0]?.appConfig ? fetchAlt1Config(weeklyTop[0].appConfig) : null,
            monthlyTop[0]?.appConfig ? fetchAlt1Config(monthlyTop[0].appConfig) : null,
        ]);

        return {
            dailyTop: dailyTop[0] ? { data: dailyTop[0], appConfig: dailyConfig } : null,
            weeklyTop: weeklyTop[0] ? { data: weeklyTop[0], appConfig: weeklyConfig } : null,
            monthlyTop: monthlyTop[0] ? { data: monthlyTop[0], appConfig: monthlyConfig } : null,
        };
    }),
});
