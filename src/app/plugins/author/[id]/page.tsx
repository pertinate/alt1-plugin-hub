import { ChevronLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { api, HydrateClient } from '~/trpc/server';

import 'github-markdown-css/github-markdown-light.css';
import 'github-markdown-css/github-markdown-dark.css';
import Link from 'next/link';
import type { Alt1Config } from '~/lib/alt1';
import { Label } from '~/components/ui/label';
import MDRender from '~/components/MDRender';
import { cache } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getAppconfig, getPlugin, getReadme, getUser, isUrl } from '~/lib/data';
import { Votes } from '~/components/votes';
import PluginListById from '~/app/_components/pluginListById';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const id = (await params).id;

    const user = await getUser(id);

    if (!user) {
        return {
            title: 'PluginHub - 404',
            description: 'User does not exist',
            openGraph: {
                title: 'PluginHub - 404',
                description: 'User does not exist',
            },
        };
    }

    return {
        title: `PluginHub - Plugins by ${user.name}`,
        description: `PluginHub - Plugins by ${user.name}`,
        openGraph: {
            title: `PluginHub - ${user.name}`,
            description: `PluginHub - Plugins by ${user.name}`,
        },
    };
}

export const revalidate = 30; //cache lasts 30 seconds

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await api.user.getUserById({ id });

    if (!user) {
        return <>User Not Found</>;
    }

    // void (await api.plugin.getPluginsById({ id: user.id }));

    return (
        <HydrateClient>
            <main className='flex shrink-0 grow-1 flex-col'>
                <div className='flex flex-col gap-4 px-8 py-4'>
                    <PluginListById id={user.id} />
                </div>
            </main>
        </HydrateClient>
    );
}
