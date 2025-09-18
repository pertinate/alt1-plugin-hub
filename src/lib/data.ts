import { cache } from 'react';
import { api } from '~/trpc/server';

export const getReadme = cache(async (url: string) => {
    return await (await fetch(url)).text();
});

export const getAppconfig = cache(async (url: string) => {
    return (await (await fetch(url)).json()) as Alt1Config;
});

export const getPlugin = cache(async (id: number) => {
    return await api.plugin.getPlugin(id);
});
