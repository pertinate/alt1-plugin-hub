import { TRPCError } from '@trpc/server';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import type { Alt1Config } from '~/lib/alt1';
import { getAppConfigs, getUserRepos, type GithubRepositoryInfo } from '~/lib/github';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { createPlugin } from '../dataGroups/createPlugin';

export const pluginRouter = createTRPCRouter({
    getRepos: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session.user.username || !ctx.session.user.accessToken) throw new TRPCError({ code: 'UNAUTHORIZED' });

        return await getUserRepos(ctx.session.user.accessToken);
    }),
    getAppConfig: protectedProcedure
        .input(
            z.object({
                repo: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (!ctx.session.user.username || !input.repo || !ctx.session.user.accessToken)
                throw new TRPCError({ code: 'UNAUTHORIZED' });

            return await getAppConfigs(ctx.session.user.username, input.repo, ctx.session.user.accessToken);
        }),
    createPlugin: createPlugin,
    getPlugin: publicProcedure.query(async ({ ctx }) => {
        // console.log(ctx.headers, ctx.session)
        return;
    }),
    getPlugins: publicProcedure.query(async ({ ctx }) => {
        // console.log(ctx.headers, ctx.session)
        return;
    }),
    updatePlugin: protectedProcedure.mutation(async ({ ctx }) => {
        // console.log(ctx.headers, ctx.session)
        return;
    }),
    deletePlugin: protectedProcedure.mutation(async ({ ctx }) => {
        // console.log(ctx.headers, ctx.session)
        return;
    }),
});
