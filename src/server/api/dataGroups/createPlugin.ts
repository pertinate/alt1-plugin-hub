import { protectedProcedure } from '../trpc';
import { pluginMetadata, plugins } from '~/server/db/schema';
import { pluginSchema } from './pluginTypes';

export const createPlugin = protectedProcedure.input(pluginSchema).mutation(async ({ ctx, input }) => {
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
