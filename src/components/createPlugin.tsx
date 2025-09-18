'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { MetadataSchema, PluginCategory, pluginSchema } from '~/server/api/dataGroups/pluginTypes';
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

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
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
                    <div>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            {...register('name')}
                            // value={field.state.value}
                            // onChange={e => field.setValue(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor='appConfig'>App Config URL</Label>
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
                        <Label htmlFor='readMe'>ReadMe URL</Label>
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
                                        <div className='relative'>
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
                                                        <SelectItem value='Support'>Support</SelectItem>
                                                        <SelectItem value='Info'>Info</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder='Name' {...register(`metadata.${index}.name`)} />
                                                <Input placeholder='Value' {...register(`metadata.${index}.value`)} />
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
                        <MultiSelect
                            values={category}
                            onValuesChange={values =>
                                setValue('category', values as z.infer<typeof pluginSchema>['category'], {
                                    shouldValidate: true,
                                })
                            }
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
