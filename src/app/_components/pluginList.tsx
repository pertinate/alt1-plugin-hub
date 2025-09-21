'use client';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '~/components/ui/command';
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { PluginCard } from '~/components/pluginCard';
import { Button } from '~/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover';
import { useDebounce } from '~/components/useDebounce';
import { allCategories } from '~/dataGroups/pluginTypes';
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';
import { Badge } from '~/components/ui/badge';
import { Label } from '~/components/ui/label';

export default function PluginList() {
    const plugins = api.plugin.getPlugins.useInfiniteQuery(
        { limit: 12 },
        { getNextPageParam: lastPage => lastPage.nextCursor }
    );
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [filter, setFilter] = useState('');

    useDebounce(search, value => {
        setFilter(value);
    });
    const getInitCategories = () =>
        allCategories.reduce(
            (acc, name) => {
                acc[name] = false;
                return acc;
            },
            {} as Record<string, boolean>
        );
    const [categories, setCheckedCategories] = useState<Record<string, boolean>>(() => getInitCategories());
    const selectedCategories = Object.entries(categories).filter(([name, checked]) => checked);

    const allCategoriesSet = new Set(selectedCategories.map(([name]) => name));

    const filteredPlugins = plugins.data?.pages
        .map(entry => entry.plugins)
        .flat()
        .filter(entry =>
            allCategoriesSet.size > 0 ? entry.data.categories?.some(e => allCategoriesSet.has(e as any)) : true
        )
        .filter(entry => entry.data.name?.toLowerCase().includes(search.toLowerCase()));

    function toggleCategory(name: string) {
        setCheckedCategories(prev => ({
            ...prev,
            [name]: !prev[name],
        }));
    }

    return (
        <>
            <div className='flex items-center justify-center'>
                <div className='flex max-w-sm gap-2'>
                    <Input
                        type='search'
                        id='search'
                        placeholder='Search...'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='w-[240px] shrink-0'
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant='outline' className='justify-between'>
                                {selectedCategories.length > 0 ? (
                                    <div className='flex gap-2'>
                                        {selectedCategories.length > 2 && (
                                            <div className='relative inline-block'>
                                                {/* back layers */}
                                                {selectedCategories.length > 4 && (
                                                    <span className='bg-muted-foreground/20 absolute inset-0 -translate-x-[5px] rounded-md' />
                                                )}
                                                {selectedCategories.length > 3 && (
                                                    <span className='bg-muted-foreground/40 absolute inset-0 -translate-x-[3px] rounded-md' />
                                                )}

                                                {/* front badge */}
                                                <Badge className='relative z-10'>{selectedCategories.length - 1}</Badge>
                                            </div>
                                        )}
                                        {selectedCategories[selectedCategories.length - 1]?.[0]}
                                    </div>
                                ) : (
                                    'Select categories...'
                                )}
                                <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[200px] p-0'>
                            <Command>
                                <CommandInput placeholder='Search categories...' />
                                <CommandList>
                                    <CommandEmpty>No categories found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => {
                                                setCheckedCategories(getInitCategories());
                                            }}
                                            className='flex'
                                        >
                                            <Button className='w-full' variant={'outline'}>
                                                Clear
                                            </Button>
                                        </CommandItem>
                                        {Object.entries(categories)
                                            .filter(([name]) =>
                                                name.toLowerCase().includes(categorySearch.toLowerCase())
                                            )
                                            .map(([name, value]) => {
                                                return (
                                                    <CommandItem
                                                        key={name}
                                                        value={name}
                                                        onSelect={currentValue => {
                                                            toggleCategory(currentValue);
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                value ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {name}
                                                    </CommandItem>
                                                );
                                            })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
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
