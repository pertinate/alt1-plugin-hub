import { protectedProcedure } from '../trpc';
import { pluginMetadata, plugins } from '~/server/db/schema';
import { isMarkdownUrl, MetadataSchema, pluginSchema, updatePluginSchema } from './pluginTypes';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

export const updatePlugin = protectedProcedure
    .input(
        updatePluginSchema.extend({
            id: z.number(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        if (!(await isMarkdownUrl(input.readMe))) {
            throw new Error('ReadMe needs to be Markdown');
        }
        return await ctx.db.transaction(async tx => {
            const [plugin] = await tx
                .update(plugins)
                // .insert(plugins)
                .set({
                    name: input.name,
                    appConfig: input.appConfig,
                    readMe: input.readMe,
                    category: Array.from(input.category),
                    status: input.status,
                    disabled: false,
                    createdById: ctx.session.user.id,
                })
                .where(and(eq(plugins.id, input.id), eq(plugins.createdById, ctx.session.user.id)))
                .returning();

            if (plugin && input.metadata.length > 0) {
                await tx
                    .insert(pluginMetadata)
                    .values(
                        input.metadata.map(entry => ({
                            ...entry,
                            createdById: ctx.session.user.id,
                            pluginId: plugin.id,
                        }))
                    )
                    .onConflictDoUpdate({
                        target: pluginMetadata.id,
                        set: {
                            type: sql.raw(`excluded.${pluginMetadata.type.name}`),
                            value: sql.raw(`excluded.${pluginMetadata.value.name}`),
                            name: sql.raw(`excluded.${pluginMetadata.name.name}`),
                        },
                    });
            }
        });
    });
