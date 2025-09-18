import { ChevronLeft, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { api, HydrateClient } from '~/trpc/server';

import 'github-markdown-css/github-markdown-light.css';
import 'github-markdown-css/github-markdown-dark.css';
import MarkdownRenderer from '~/app/_components/markdown';
import Link from 'next/link';
import type { Alt1Config } from '~/lib/alt1';
import { Label } from '~/components/ui/label';
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';
import MDRender from '~/components/MDRender';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await auth();

    if (!session) {
        // This will redirect on the server
        redirect('/api/auth/signin'); // or "/api/auth/signin" if using next-auth
    }

    const plugins = await api.plugin.getPlugin(Number(id));

    const plugin = plugins[0];

    if (!plugin) {
        return undefined;
    }

    const readMeContents = await (await fetch(plugin.readMe!)).text();

    const appConfigContents = (await (await fetch(plugin.appConfig!)).json()) as Alt1Config;

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
                            {}
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
                            <CardTitle>Support</CardTitle>
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
