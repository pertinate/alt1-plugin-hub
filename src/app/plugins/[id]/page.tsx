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
import { getAppconfig, getPlugin, getReadme } from '~/lib/data';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const id = Number((await params).id);

    const plugins = await getPlugin(id);
    const plugin = plugins[0];

    // shared icons (favicon & apple touch icon)
    const icons = [
        { rel: 'icon', url: '/icon.png' },
        { rel: 'apple-touch-icon', url: '/icon.png' },
    ];

    if (!plugin) {
        return {
            title: 'PluginHub - Plugin does not exist',
            description: 'Plugin does not exist',
            icons,
            openGraph: {
                title: 'PluginHub - Plugin does not exist',
                description: 'Plugin does not exist',
                images: [
                    {
                        url: '/icon.png', // static fallback OG image
                        width: 1200,
                        height: 630,
                        alt: 'PluginHub preview image',
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                images: ['/icon.png'],
            },
        };
    }

    const appConfigContents = await getAppconfig(plugin.appConfig!);

    return {
        title: `PluginHub - ${plugin.name}`,
        description: appConfigContents.description,
        icons,
        openGraph: {
            title: `PluginHub - ${plugin.name}`,
            description: appConfigContents.description,
            images: [
                {
                    url: '/icon.png', // or generate a plugin-specific image if you have one
                    width: 1200,
                    height: 630,
                    alt: `Preview image for ${plugin.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            images: ['/icon.png'],
        },
    };
}

export const revalidate = 30; //cache lasts 30 seconds

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const plugins = await getPlugin(Number(id));

    const plugin = plugins[0];

    if (!plugin) {
        return undefined;
    }

    const readMeContents = await getReadme(plugin.readMe!);

    const appConfigContents = await getAppconfig(plugin.appConfig!);

    return (
        <HydrateClient>
            <main className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                <div className='xl: col-span-4 m-4 flex flex-col gap-4 md:col-span-3'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex justify-between gap-4 border-b'>
                            <div className='flex gap-4'>
                                <Button variant={'outline'} asChild>
                                    <Link href='/' className='flex items-center justify-center gap-2'>
                                        <ChevronLeft />
                                        Home
                                    </Link>
                                </Button>
                                <div className='flex flex-row gap-4'>
                                    <img className='h-10' src={appConfigContents.iconUrl} alt='Plugin Icon' />
                                    <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                                        {plugin.name}
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <p className='text-muted-foreground text-sm'>{appConfigContents.description}</p>
                    </div>
                    <MDRender contents={readMeContents} />
                </div>
                <div className='m-4 flex flex-col gap-4 md:col-span-2'>
                    <Card>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4'>
                                <Button asChild>
                                    <Link
                                        href={`alt1://addapp/${plugin.appConfig}`}
                                        className='flex items-center justify-center gap-2'
                                    >
                                        Install
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Plugin Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-md font-extrabold'>Author</Label>
                                    <Label className='text-xlg font-extralight'>{plugin.createByUser}</Label>
                                </div>
                                {plugin.metadata
                                    .filter(entry => entry.type == 'Info')
                                    .map(entry => (
                                        <div className='flex flex-col gap-2'>
                                            <Label className='text-md font-extrabold'>{entry.name}</Label>
                                            <Label className='text-xlg font-extralight'>{entry.value}</Label>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                {plugin.metadata
                                    .filter(entry => entry.type == 'Support')
                                    .map(entry => (
                                        <Button variant={'outline'} asChild key={`support-${entry.id}`}>
                                            <Link href={entry.value} target='__blank'>
                                                {entry.name}
                                            </Link>
                                        </Button>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </HydrateClient>
    );
}
