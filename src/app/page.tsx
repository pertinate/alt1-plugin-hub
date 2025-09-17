import Link from 'next/link';

import { LatestPost } from '~/app/_components/post';
import { ThemeToggle } from '~/components/theme-toggle';
import { Button } from '~/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '~/components/ui/context-menu';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { addPluginHubLink } from '~/lib/alt1';
import { auth } from '~/server/auth';
import { api, HydrateClient } from '~/trpc/server';
import { ArrowDown, ArrowUp, ThumbsDown, ThumbsUp } from 'lucide-react';
import { headers } from 'next/headers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { BannerWrapper } from '~/components/bannerWrapper';
import { Ribbon } from '~/components/ribbon';
import { PluginCard } from '~/components/pluginCard';
import PluginList from './_components/pluginList';

export default async function Home() {
    const topVoted = await api.votes.getTopVoted();

    const votedMap = [
        {
            type: 'Monthly',
            data: topVoted.monthlyTop,
        },
        {
            type: 'Weekly',
            data: topVoted.weeklyTop,
        },
        {
            type: 'Daily',
            data: topVoted.dailyTop,
        },
    ];

    void (await api.plugin.getPlugins.prefetchInfinite({ limit: 12 }));

    return (
        <HydrateClient>
            <main className='flex shrink-0 grow-1 flex-col'>
                <div className='flex flex-col gap-4 px-8 py-4'>
                    <Card className='p-2'>
                        <Collapsible>
                            <CollapsibleTrigger className='w-full'>
                                <CardHeader>
                                    <CardTitle>Top Plugins</CardTitle>
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className='m-0 p-0'>
                                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                                        {votedMap.map(
                                            entry =>
                                                entry.data &&
                                                entry.data.appConfig && (
                                                    <BannerWrapper text={entry.type} key={entry.type}>
                                                        <PluginCard
                                                            data={entry.data.data}
                                                            appConfig={entry.data.appConfig}
                                                        />
                                                    </BannerWrapper>
                                                )
                                        )}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                    <PluginList />
                </div>
            </main>
        </HydrateClient>
    );
}
