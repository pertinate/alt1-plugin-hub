'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Badge } from './ui/badge';
import z from 'zod';
import {
    isMarkdownUrl,
    isValidJsonUrl,
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
import { toast } from 'sonner';

const categories = Object.values(PluginCategory.options); // your RS3Skills + OtherCategories union
const updateWithoutId = updatePluginSchema.omit({ id: true });

function UpdatePluginForm({ plugin }: { plugin: RouterOutputs['plugin']['getPlugin'][number] }) {
    const utils = api.useUtils();
    const mutation = api.plugin.updatePlugin.useMutation({
        onSuccess: () => {
            utils.plugin.invalidate(); // refetch list if you have one
            utils.plugin.getCreatedPlugins.refetch();
            utils.plugin.getPlugin.refetch();
            toast(plugin.name, {
                description: 'Plugin updated.',
            });
        },
    });

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
            name: plugin.name!,
            appConfig: plugin.appConfig!,
            readMe: plugin.readMe!,
            metadata: plugin.metadata! as z.infer<typeof updatePluginSchema>['metadata'],
            category: plugin.category! as typeof categories,
            status: plugin.status! as z.infer<typeof updatePluginSchema>['status'],
        } satisfies z.infer<typeof updateWithoutId>,
        resolver: zodResolver(pluginSchema),
    });

    const status = watch('status');
    const category = watch('category');

    const metadata = useFieldArray({
        control,
        name: 'metadata',
    });

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='flex gap-4'>Update Plugin</DialogTitle>
                <DialogDescription>Fill out the form to update this plugin.</DialogDescription>
            </DialogHeader>
            <form
                className='space-y-4'
                onSubmit={handleSubmit(async values => {
                    if (!(await isValidJsonUrl(values.appConfig))) {
                        setError('appConfig', {
                            type: 'validate',
                            message: 'URL does not return valid JSON',
                        });
                        // optionally show a toast
                        toast.error('AppConfig URL must return valid JSON');
                        return; // prevent mutation
                    }

                    if (!(await isMarkdownUrl(values.readMe))) {
                        toast.error('ReadMe needs to be Markdown');
                        return;
                    }

                    await mutation.mutateAsync({
                        ...values,
                        id: plugin.id,
                    });
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
                    <Label htmlFor='appConfig'>App Config URL</Label>
                    <Input
                        id='appConfig'
                        // type='url'
                        {...register('appConfig')}
                        // value={field.state.value}
                        // onChange={e => field.setValue(e.target.value)}
                        required
                    />
                    {errors.appConfig && <Label className='text-destructive text-sm'>{errors.appConfig.message}</Label>}
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
                                metadata.fields.length < 15 && metadata.append({ type: 'Support', name: '', value: '' })
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
                        {mutation.isPending ? 'Updating...' : 'Update'}
                    </Button>
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
