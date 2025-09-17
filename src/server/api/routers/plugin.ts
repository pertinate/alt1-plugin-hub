import { TRPCError } from '@trpc/server';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import type { Alt1Config } from '~/lib/alt1';
import { getAppConfigs, getUserRepos, type GithubRepositoryInfo } from '~/lib/github';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { createPlugin } from '../dataGroups/createPlugin';
import { pluginMetadata, plugins, votes } from '~/server/db/schema';
import { and, desc, eq, lt, sql } from 'drizzle-orm';
import { fetchAlt1Config } from '~/util/fetchAlt1Config';
import { updatePlugin } from '../dataGroups/updatePlugin';
import { metadata } from '~/app/layout';

export const pluginRouter = createTRPCRouter({
    getCreatedPlugins: protectedProcedure.query(async ({ ctx }) => {
        // if (!ctx.session.user.username || !ctx.session.user.accessToken) throw new TRPCError({ code: 'UNAUTHORIZED' });

        return await ctx.db
            .select({
                id: plugins.id,
                name: plugins.name,
                appConfig: plugins.appConfig,
                readMe: plugins.readMe,
                category: plugins.category,
                status: plugins.status,
                createdAt: plugins.createdAt,
                updatedAt: plugins.updatedAt,
            })
            .from(plugins)
            .where(eq(plugins.createdById, ctx.session.user.id))
            .orderBy(desc(plugins.updatedAt));
    }),
    getAppConfig: protectedProcedure
        .input(
            z.object({
                repo: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            // if (!ctx.session.user.username || !input.repo || !ctx.session.user.accessToken)
            //     throw new TRPCError({ code: 'UNAUTHORIZED' });
            // return await getAppConfigs(ctx.session.user.username, input.repo, ctx.session.user.accessToken);
        }),
    createPlugin: createPlugin,
    getPlugin: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        return await await ctx.db
            .select({
                id: plugins.id,
                name: plugins.name,
                appConfig: plugins.appConfig,
                readMe: plugins.readMe,
                category: plugins.category,
                status: plugins.status,
                disabled: plugins.disabled,
                createdById: plugins.createdById,
                createdAt: plugins.createdAt,
                updatedAt: plugins.updatedAt,
                metadata: sql<{ id: number; type: string; name: string; value: string }[]>`
                coalesce(
                    json_agg(
                    json_build_object(
                        'id', ${pluginMetadata.id},
                        'type', ${pluginMetadata.type},
                        'name', ${pluginMetadata.name},
                        'value', ${pluginMetadata.value}
                    )
                    ) filter (where ${pluginMetadata.id} is not null),
                    '[]'
                )
                `,
            })
            .from(plugins)
            .leftJoin(pluginMetadata, eq(pluginMetadata.pluginId, plugins.id))
            .where(eq(plugins.id, input))
            .groupBy(plugins.id);
    }),
    getPlugins: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(12),
                cursor: z.number().nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { limit, cursor } = input;

            const pluginsQuery = ctx.db
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
                          >`MAX(CASE WHEN ${votes.createdById} = ${ctx.session.user.id} THEN ${votes.value} ELSE NULL END)`
                        : sql<number | null>`NULL`,
                })
                .from(plugins)
                .leftJoin(votes, eq(votes.pluginId, plugins.id))
                .groupBy(plugins.id, plugins.name, plugins.appConfig)
                .orderBy(desc(plugins.id)) // keep cursor-compatible ordering
                .limit(limit + 1);

            if (cursor) {
                pluginsQuery.where(lt(plugins.id, cursor));
            }

            const rows = await pluginsQuery;

            let nextCursor: number | null = null;
            if (rows.length > limit) {
                const nextItem = rows.pop(); // remove extra row
                nextCursor = nextItem!.pluginId;
            }

            // fetch configs in parallel
            const configs = await Promise.all(
                rows.map(row => (row.appConfig ? fetchAlt1Config(row.appConfig) : Promise.resolve(null)))
            );

            const pluginsWithConfig = rows.map((row, i) => ({
                data: row,
                appConfig: configs[i],
            }));

            return {
                plugins: pluginsWithConfig,
                nextCursor,
            };
        }),

    updatePlugin: updatePlugin,
    deletePlugin: protectedProcedure.input(z.number().gte(0)).mutation(async ({ ctx, input }) => {
        await ctx.db.transaction(async tx => {
            await tx.delete(pluginMetadata).where(eq(pluginMetadata.pluginId, input));
            await tx.delete(plugins).where(and(eq(plugins.id, input), eq(plugins.createdById, ctx.session.user.id)));
        });
        return { success: true };
    }),
});
