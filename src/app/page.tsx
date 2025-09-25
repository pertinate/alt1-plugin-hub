import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { api, HydrateClient } from '~/trpc/server';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { BannerWrapper } from '~/components/bannerWrapper';
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

    void (await api.plugin.getPlugins.prefetchInfinite({ limit: 12, search: '', categories: [] }));

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
