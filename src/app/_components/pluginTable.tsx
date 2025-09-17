'use client';

import { DataTable } from '~/components/data-table';
import { api } from '~/trpc/react';

export const PluginTable = () => {
    const plugins = api.plugin.getCreatedPlugins.useQuery();
    const mappedPlugins = (plugins.data ?? []).map(plugin => ({
        id: plugin.id,
        name: plugin.name ?? '',
        appConfig: plugin.appConfig ?? '',
        readMe: plugin.readMe ?? '',
        category: plugin.category ?? [],
        status: plugin.status ?? '',
        createdAt: plugin.createdAt,
        updatedAt: plugin.updatedAt ?? plugin.createdAt,
    }));
    return <DataTable data={mappedPlugins} />;
};
