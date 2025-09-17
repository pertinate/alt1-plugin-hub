'use client';

import { useForm } from '@tanstack/react-form';
import { Label } from './ui/label';
import { api } from '~/trpc/react'; // <-- tRPC client hook
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
import { PluginCategory, pluginSchema } from '~/server/api/dataGroups/pluginTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectValue,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
} from './ui/multi-select';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const categories = Object.values(PluginCategory.options); // your RS3Skills + OtherCategories union

export function CreatePlugin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const utils = api.useUtils();
    const mutation = api.plugin.createPlugin.useMutation({
        onSuccess: () => {
            utils.plugin.invalidate();
            setIsModalOpen(false);
        },
    });

    const form = useForm({
        defaultValues: {
            name: '',
            appConfig: '',
            readMe: '',
            metadata: [{ type: 'Support' as const, name: '', value: '' }],
            category: new Set<z.infer<typeof PluginCategory>>(),
            status: 'In Development',
        } as z.infer<typeof pluginSchema>,
        validators: {
            onChange: pluginSchema,
        },
        onSubmit: async values => {
            mutation
                .mutateAsync({
                    ...values.value,
                    category: values.value.category,
                })
                .catch(console.error);
        },
    });

    return (
        <Dialog open={isModalOpen}>
            <DialogTrigger asChild>
                <Button className='flex items-center justify-center gap-2' onClick={() => setIsModalOpen(true)}>
                    <PlusIcon />
                    <span className='hidden lg:inline'>New</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Plugin</DialogTitle>
                    <DialogDescription>Fill out the form to create a new plugin.</DialogDescription>
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
                                {field.state.meta.errors[0] && (
                                    <p className='text-sm text-red-500'>{field.state.value}</p>
                                )}
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
                            <form.Field name='metadata' mode='array'>
                                {field => {
                                    return (
                                        <div className='flex flex-col gap-2'>
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
                                                            <Input
                                                                placeholder='Value'
                                                                value={f.state.value}
                                                                onChange={e => f.setValue(e.target.value)}
                                                            />
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
                                                onClick={() =>
                                                    field.pushValue({ type: 'Support', name: '', value: '' })
                                                }
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
                        <Button disabled={mutation.isPending}>{mutation.isPending ? 'Creating...' : 'Create'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
