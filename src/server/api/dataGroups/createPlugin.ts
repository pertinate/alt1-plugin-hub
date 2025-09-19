import { protectedProcedure } from '../trpc';
import { pluginMetadata, plugins } from '~/server/db/schema';
import { isMarkdownUrl, isValidJsonUrl, pluginSchema } from './pluginTypes';

export const createPlugin = protectedProcedure.input(pluginSchema).mutation(async ({ ctx, input }) => {
    if (!(await isMarkdownUrl(input.readMe))) {
        throw new Error('ReadMe needs to be Markdown');
    }

    if (!(await isValidJsonUrl(input.appConfig))) {
        throw new Error('AppConfig needs to be JSON');
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

        if (newPlugin) {
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
