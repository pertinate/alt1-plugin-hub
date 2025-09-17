'use client';

import { useForm } from '@tanstack/react-form';
import { Label } from './ui/label';
import { api, type RouterOutputs } from '~/trpc/react'; // <-- tRPC client hook
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import z from 'zod';
import {
    MetadataSchema,
    MetaInfoSchema,
    MetaSupportSchema,
    PluginCategory,
    pluginSchema,
    updatePluginSchema,
} from '~/server/api/dataGroups/pluginTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
} from './ui/multi-select';
import { EditIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '~/lib/utils';

const categories = Object.values(PluginCategory.options); // your RS3Skills + OtherCategories union

function UpdatePluginForm({ plugin }: { plugin: RouterOutputs['plugin']['getPlugin'][number] }) {
    const utils = api.useUtils();
    const mutation = api.plugin.updatePlugin.useMutation({
        onSuccess: () => {
            utils.plugin.invalidate(); // refetch list if you have one
            utils.plugin.getCreatedPlugins.refetch();
        },
    });
    const form = useForm({
        defaultValues: {
            id: plugin.id!,
            name: plugin.name!,
            appConfig: plugin.appConfig!,
            readMe: plugin.readMe!,
            metadata: plugin.metadata! as z.infer<typeof updatePluginSchema>['metadata'],
            category: plugin.category! as typeof categories,
            status: plugin.status! as z.infer<typeof updatePluginSchema>['status'],
        } satisfies z.infer<typeof updatePluginSchema>,
        validators: {
            onChange: updatePluginSchema,
        },
        onSubmit: async values => {
            await mutation.mutateAsync({
                ...values.value,
                category: values.value.category,
                metadata: values.value.metadata,
                id: plugin.id,
            });
        },
    });

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Plugin</DialogTitle>
                <DialogDescription>Fill out the form to edit this plugin.</DialogDescription>
            </DialogHeader>
            <form
                className='space-y-4'
                onSubmit={e => {
                    e.preventDefault();
                    form.handleSubmit(e);
                }}
            >
                <form.Field name='name'>
                    {field => (
                        <div>
                            <Label htmlFor='name'>Name</Label>
                            <Input
                                id='name'
                                value={field.state.value}
                                onChange={e => field.setValue(e.target.value)}
                                required
                            />
                            {field.state.meta.errors[0] && <p className='text-sm text-red-500'>{field.state.value}</p>}
                        </div>
                    )}
                </form.Field>

                <form.Field name='appConfig'>
                    {field => (
                        <div>
                            <Label htmlFor='appConfig'>App Config URL</Label>
                            <Input
                                id='appConfig'
                                type='url'
                                value={field.state.value}
                                onChange={e => field.setValue(e.target.value)}
                                required
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name='readMe'>
                    {field => (
                        <div>
                            <Label htmlFor='readMe'>ReadMe URL</Label>
                            <Input
                                id='readMe'
                                type='url'
                                value={field.state.value}
                                onChange={e => field.setValue(e.target.value)}
                                required
                            />
                        </div>
                    )}
                </form.Field>

                <div>
                    <Label>Metadata</Label>

                    <div className='space-y-2'>
                        <form.Field name='metadata' mode='array' validators={{ onSubmit: z.array(MetadataSchema) }}>
                            {field => {
                                return (
                                    <div className='mt-2 flex flex-col gap-4'>
                                        {field.state.value.map((fieldItem, index) => (
                                            <div
                                                key={`${fieldItem.type}.${fieldItem.name}.${index}`}
                                                className='flex items-center gap-2'
                                            >
                                                <form.Field name={`metadata[${index}].type`}>
                                                    {f => (
                                                        <Select
                                                            onValueChange={value => f.handleChange(value as any)}
                                                            defaultValue={f.state.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Type' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Support'>Support</SelectItem>
                                                                <SelectItem value='Info'>Info</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </form.Field>

                                                <form.Field name={`metadata[${index}].name`}>
                                                    {f => (
                                                        <Input
                                                            placeholder='Name'
                                                            value={f.state.value}
                                                            onChange={e => f.setValue(e.target.value)}
                                                        />
                                                    )}
                                                </form.Field>

                                                <form.Field name={`metadata[${index}].value`}>
                                                    {f => (
                                                        <div>
                                                            <Input
                                                                placeholder='Value'
                                                                value={f.state.value}
                                                                onChange={e => f.setValue(e.target.value)}
                                                            />
                                                            <Label className='absolute left-8 text-red-400'>
                                                                {f.state.meta.errors.map(entry => entry?.message)}
                                                            </Label>
                                                        </div>
                                                    )}
                                                </form.Field>

                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={() => field.removeValue(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type='button'
                                            variant='secondary'
                                            className='mt-2'
                                            onClick={() => field.pushValue({ type: 'Support', name: '', value: '' })}
                                        >
                                            + Add Metadata
                                        </Button>
                                    </div>
                                );
                            }}
                        </form.Field>
                    </div>
                </div>

                {/* Category multi-select */}
                <form.Field name='category'>
                    {field => (
                        <div className='z-10'>
                            <Label>Category</Label>
                            <MultiSelect
                                onValuesChange={value => field.handleChange(value as any)}
                                defaultValues={Array.from(field.state.value)}
                            >
                                <MultiSelectTrigger className='w-full max-w-[400px]'>
                                    <MultiSelectValue placeholder='Select Categories...' />
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                    <MultiSelectGroup>
                                        {categories.map(cat => (
                                            <MultiSelectItem key={cat} value={cat}>
                                                {cat}
                                            </MultiSelectItem>
                                        ))}
                                    </MultiSelectGroup>
                                </MultiSelectContent>
                            </MultiSelect>
                        </div>
                    )}
                </form.Field>

                {/* Status select */}
                <form.Field name='status'>
                    {field => (
                        <div>
                            <Label>Status</Label>

                            <Select
                                onValueChange={value => field.handleChange(value as any)}
                                defaultValue={field.state.value}
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
                    )}
                </form.Field>

                <div className='flex w-full flex-col'>
                    <Button disabled={mutation.isPending}>{mutation.isPending ? 'Updating...' : 'Update'}</Button>
                </div>
            </form>
        </DialogContent>
    );
}

export function UpdatePlugin({ id }: { id: number }) {
    const [open, setOpen] = useState(false);
    const plugins = api.plugin.getPlugin.useQuery(id, { enabled: false });
    const utils = api.useUtils();

    const plugin = plugins!.data?.[0]!;

    return (
        <>
            <DialogTrigger
                className='flex items-center justify-center gap-2'
                onClick={() => {
                    plugins.refetch();
                }}
                asChild
            >
                <Button className='w-full' variant={'outline'}>
                    <EditIcon />
                    <span className='hidden lg:inline'>Edit</span>
                </Button>
            </DialogTrigger>
            {plugin && <UpdatePluginForm plugin={plugin} />}
        </>
    );
}
