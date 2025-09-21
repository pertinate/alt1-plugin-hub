import { cache } from 'react';
import { api } from '~/trpc/server';
import type { Alt1Config } from './alt1';

export const getReadme = cache(async (url: string) => {
    return await (await fetch(url)).text();
});

export const getAppconfig = cache(async (url: string) => {
    return (await (await fetch(url)).json()) as Alt1Config;
});

export const getPlugin = cache(async (id: number) => {
    return await api.plugin.getPlugin(id);
});

export function isUrl(path: string): boolean {
    try {
        const url = new URL(path);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false; // Not a valid URL
    }
}
