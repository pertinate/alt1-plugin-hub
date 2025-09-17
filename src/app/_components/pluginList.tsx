'use client';
import { useState } from 'react';
import { PluginCard } from '~/components/pluginCard';
import { Input } from '~/components/ui/input';
import { useDebounce } from '~/components/useDebounce';
import { api } from '~/trpc/react';

export default function PluginList() {
    const plugins = api.plugin.getPlugins.useInfiniteQuery(
        { limit: 12 },
        { getNextPageParam: lastPage => lastPage.nextCursor }
    );
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    useDebounce(search, value => {
        setFilter(value);
    });

    const filteredPlugins = plugins.data?.pages
        .map(entry => entry.plugins)
        .flat()
        .filter(entry => entry.data.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <div className='flex items-center justify-center'>
                <div className='flex max-w-sm gap-2'>
                    <Input
                        type='search'
                        id='search'
                        placeholder='Search...'
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {filteredPlugins &&
                    filteredPlugins.map(
                        entry =>
                            entry.appConfig && (
                                <PluginCard
                                    key={`plugin-${entry.data.pluginId}`}
                                    data={entry.data}
                                    appConfig={entry.appConfig}
                                />
                            )
                    )}
            </div>
        </>
    );
}
