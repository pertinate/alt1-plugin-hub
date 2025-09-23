'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from './ui/label';
import { api } from '~/trpc/react'; // <-- tRPC client hook
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import z from 'zod';
import { allCategories, isMarkdownUrl, isValidJsonUrl, PluginCategory, pluginSchema } from '~/dataGroups/pluginTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckIcon, ChevronsUpDownIcon, Info, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Badge } from './ui/badge';
import { cn } from '~/lib/utils';

export function CreatePlugin() {
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const utils = api.useUtils();
    const mutation = api.plugin.createPlugin.useMutation({
        onSuccess: (data, variables) => {
            utils.plugin.invalidate();
            setIsModalOpen(false);

            reset();

            toast(variables.name, {
                description: 'Plugin created.',
            });
        },
        onError(error, variables, context) {
            console.error(error, variables);

            toast('There was an issue creating your plugin', { description: error.message });
        },
    });

    console.log(pluginSchema.shape.metadata._def);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            appConfig: '',
            readMe: '',
            metadata: [],
            category: [],
            status: 'In Development',
        } as z.infer<typeof pluginSchema>,
        resolver: zodResolver(pluginSchema),
    });

    const status = watch('status');
    const category = watch('category');

    const metadata = useFieldArray({
        control,
        name: 'metadata',
    });

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={open => {
                setIsModalOpen(open);

                if (!open) {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className='flex items-center justify-center gap-2' onClick={() => setIsModalOpen(true)}>
                    <PlusIcon />
                    <span className='hidden lg:inline'>New</span>
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>New Plugin</DialogTitle>
                    <DialogDescription>Fill out the form to create a new plugin.</DialogDescription>
                </DialogHeader>
                <form
                    className='space-y-4'
                    onSubmit={handleSubmit(async values => {
                        await mutation.mutateAsync(values);
                    })}
                >
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            {...register('name')}
                            // value={field.state.value}
                            // onChange={e => field.setValue(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor='appConfig'>App Config URL</Label>
                            <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='ghost' // or "outline" if you want a border
                                            size='icon'
                                            className='h-2 w-2 rounded-full p-0' // tweak padding/shape
                                            aria-label='More information'
                                        >
                                            <Info className='h-2 w-4' />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent side='top'>
                                        This field requires direct links, like{' '}
                                        <Link
                                            href={'https://www.techpure.dev/RS3QuestBuddy/appconfig.prod.json'}
                                            className='break-words text-blue-500 underline'
                                        >
                                            this
                                        </Link>
                                        . This should be valid JSON.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input
                            id='appConfig'
                            // type='url'
                            {...register('appConfig')}
                            // value={field.state.value}
                            // onChange={e => field.setValue(e.target.value)}
                            required
                        />
                        {errors.appConfig && (
                            <Label className='text-destructive text-sm'>{errors.appConfig.message}</Label>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor='readMe'>ReadMe URL</Label>
                            <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='ghost' // or "outline" if you want a border
                                            size='icon'
                                            className='h-2 w-2 rounded-full p-0' // tweak padding/shape
                                            aria-label='More information'
                                        >
                                            <Info className='h-2 w-4' />
                                        </Button>
                                    </TooltipTrigger>

                                    <TooltipContent side='top'>
                                        This field requires direct links, like{' '}
                                        <Link
                                            href={
                                                'https://raw.githubusercontent.com/Techpure2013/RS3QuestBuddy/refs/heads/master/README.md'
                                            }
                                            className='break-words text-blue-500 underline'
                                        >
                                            this
                                        </Link>
                                        . This should be valid Markdown.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input
                            id='readMe'
                            // type='url'
                            {...register('readMe')}
                            // value={field.state.value}
                            // onChange={e => field.setValue(e.target.value)}
                            required
                        />
                        {errors.readMe && <Label className='text-destructive text-sm'>{errors.readMe.message}</Label>}
                    </div>

                    <div>
                        <Label>Metadata</Label>

                        <div className='space-y-2'>
                            <div className='mt-2 flex max-h-64 flex-col gap-4 overflow-auto'>
                                {metadata.fields.map((fieldItem, index) => {
                                    const type = watch(`metadata.${index}.type`);
                                    return (
                                        <div className='relative' key={`update-${fieldItem.name}`}>
                                            <div className='flex items-center gap-2'>
                                                <Select
                                                    value={type}
                                                    onValueChange={value =>
                                                        setValue(
                                                            `metadata.${index}.type`,
                                                            value as z.infer<
                                                                typeof pluginSchema
                                                            >['metadata'][number]['type'],
                                                            {
                                                                shouldValidate: true,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Type' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='Support'>Link</SelectItem>
                                                        <SelectItem value='Info'>Info</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder='Name' {...register(`metadata.${index}.name`)} />
                                                <Input
                                                    placeholder={type == 'Info' ? 'Text' : 'URL'}
                                                    {...register(`metadata.${index}.value`)}
                                                />
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={() => metadata.remove(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            {errors.metadata?.[index]?.value && (
                                                <Label className='text-destructive text-sm'>
                                                    {errors.metadata[index]?.value?.message}
                                                </Label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <Button
                                type='button'
                                variant='secondary'
                                className='mt-2 w-full'
                                onClick={() =>
                                    metadata.fields.length < 15 &&
                                    metadata.append({ type: 'Support', name: '', value: '' })
                                }
                            >
                                + Add Metadata
                            </Button>
                        </div>
                    </div>

                    {/* Category multi-select */}
                    <div className='z-10 flex flex-col gap-2'>
                        <Label>Category</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant='outline' className='justify-between'>
                                    {category.length > 0 ? (
                                        <div className='flex gap-2'>
                                            {category.length > 1 && (
                                                <div className='relative inline-block'>
                                                    {/* back layers */}
                                                    {category.length > 3 && (
                                                        <span className='bg-muted-foreground/20 absolute inset-0 -translate-x-[5px] rounded-md' />
                                                    )}
                                                    {category.length > 2 && (
                                                        <span className='bg-muted-foreground/40 absolute inset-0 -translate-x-[3px] rounded-md' />
                                                    )}

                                                    {/* front badge */}
                                                    <Badge className='relative z-10'>{category.length - 1}</Badge>
                                                </div>
                                            )}
                                            {category[category.length - 1]}
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
                                                    setValue('category', []);
                                                }}
                                                className='flex'
                                            >
                                                <Button className='w-full' variant={'outline'}>
                                                    Clear
                                                </Button>
                                            </CommandItem>
                                            {allCategories.map((name, value) => {
                                                return (
                                                    <CommandItem
                                                        key={name}
                                                        value={name}
                                                        onSelect={currentValue => {
                                                            if (category.includes(currentValue as any)) {
                                                                setValue(
                                                                    'category',
                                                                    category.filter(
                                                                        entry => entry != currentValue
                                                                    ) as z.infer<typeof pluginSchema>['category'],
                                                                    {
                                                                        shouldValidate: true,
                                                                    }
                                                                );
                                                            } else {
                                                                setValue(
                                                                    'category',
                                                                    [...category, currentValue] as z.infer<
                                                                        typeof pluginSchema
                                                                    >['category'],
                                                                    {
                                                                        shouldValidate: true,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                category.includes(name) ? 'opacity-100' : 'opacity-0'
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

                    {/* Status select */}
                    <div className='flex flex-col gap-2'>
                        <Label>Status</Label>

                        <Select
                            value={status}
                            onValueChange={value =>
                                setValue('status', value as z.infer<typeof pluginSchema>['status'], {
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Status...' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='In Development'>In Development</SelectItem>
                                <SelectItem value='Published'>Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex w-full flex-col'>
                        <Button type='submit' disabled={mutation.isPending}>
                            {mutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
