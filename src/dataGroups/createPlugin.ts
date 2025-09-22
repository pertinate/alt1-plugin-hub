import { protectedProcedure } from '../server/api/trpc';
import { pluginMetadata, plugins } from '~/server/db/schema';
import { isMarkdownUrl, isValidJsonUrl, pluginSchema } from './pluginTypes';
import { TRPCError } from '@trpc/server';

export const createPlugin = protectedProcedure.input(pluginSchema).mutation(async ({ ctx, input }) => {
    if (!(await isMarkdownUrl(input.readMe))) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'ReadMe needs to be Markdown' });
    }

    if (!(await isValidJsonUrl(input.appConfig))) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'AppConfig needs to be JSON' });
    }
    return await ctx.db.transaction(async tx => {
        const [newPlugin] = await tx
            .insert(plugins)
            .values({
                name: input.name,
                appConfig: input.appConfig,
                readMe: input.readMe,
                category: Array.from(input.category),
                status: input.status,
                disabled: false,
                createdById: ctx.session.user.id,
            })
            .returning();

        if (newPlugin && input.metadata.length > 0) {
            await tx.insert(pluginMetadata).values(
                input.metadata.map(entry => ({
                    ...entry,
                    createdById: ctx.session.user.id,
                    pluginId: newPlugin.id,
                }))
            );
        }
    });
});
