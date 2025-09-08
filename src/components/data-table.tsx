'use client';

// #region Imports
import * as React from 'react';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
    IconTrendingUp,
} from '@tabler/icons-react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type Row,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart';
import { Checkbox } from '~/components/ui/checkbox';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/components/ui/drawer';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { HomeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
//#endregion

export const schema = z.object({
    id: z.number(),
    name: z.string(),
    appConfig: z.string(),
    readMe: z.string(),
    category: z.array(z.string()),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    // {
    //     id: 'drag',
    //     header: () => null,
    //     cell: ({ row }) => <DragHandle id={row.original.id} />,
    // },
    {
        id: 'select',
        header: ({ table }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            return <Label>{row.original.name}</Label>;
        },
        enableHiding: false,
    },
    {
        accessorKey: 'appConfig',
        header: 'App Config',
        cell: ({ row }) => (
            <div className='w-32'>
                <Badge variant='outline' className='text-muted-foreground px-1.5'>
                    {new URL(row.original.appConfig).host}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant='outline' className='text-muted-foreground px-1.5'>
                {row.original.status === 'Done' ? (
                    <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400' />
                ) : (
                    <IconLoader />
                )}
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
            <Badge variant='outline' className='text-muted-foreground px-1.5'>
                {row.original.createdAt.toLocaleDateString()}
            </Badge>
        ),
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Update',
        cell: ({ row }) => (
            <Badge variant='outline' className='text-muted-foreground px-1.5'>
                {row.original.updatedAt.toLocaleString()}
            </Badge>
        ),
    },
    {
        id: 'actions',
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                        size='icon'
                    >
                        <IconDotsVertical />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-32'>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    );
}

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
    const [data, setData] = React.useState<typeof initialData>(() => [
        {
            id: 0,
            name: 'plugin test',
            appConfig: 'https://techpure.dev/RS3QuestBuddy/appconfig.prod.json',
            readMe: 'https://raw.githubusercontent.com/Techpure2013/RS3QuestBuddy/refs/heads/master/README.md',
            category: [],
            status: 'In Progress',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const sortableId = React.useId();
    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: row => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData(data => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    return (
        // <Tabs defaultValue='outline' className='w-full flex-col justify-start gap-6'>

        // </Tabs>
        <div className='w-full flex-col justify-start gap-6'>
            <div className='overflow-hidden rounded-lg border'>
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className='bg-muted sticky top-0 z-10'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                            {table.getRowModel().rows?.length ? (
                                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                    {table.getRowModel().rows.map(row => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <div className='flex items-center justify-between px-4'>
                <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
                    row(s) selected.
                </div>
                <div className='flex w-full items-center gap-8 lg:w-fit'>
                    <div className='hidden items-center gap-2 lg:flex'>
                        <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={value => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side='top'>
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex w-fit items-center justify-center text-sm font-medium'>
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className='ml-auto flex items-center gap-2 lg:ml-0'>
                        <Button
                            variant='outline'
                            className='hidden h-8 w-8 p-0 lg:flex'
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className='sr-only'>Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant='outline'
                            className='size-8'
                            size='icon'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className='sr-only'>Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant='outline'
                            className='size-8'
                            size='icon'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className='sr-only'>Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant='outline'
                            className='hidden size-8 lg:flex'
                            size='icon'
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className='sr-only'>Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
//     return (
//         <Drawer direction={'right'}>
//             <DrawerTrigger asChild>
//                 <Button variant='link' className='text-foreground w-fit px-0 text-left'>
//                     {item.header}
//                 </Button>
//             </DrawerTrigger>
//             <DrawerContent>
//                 <DrawerHeader className='gap-1'>
//                     <DrawerTitle>{item.header}</DrawerTitle>
//                     <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
//                 </DrawerHeader>
//                 <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
//                     <form className='flex flex-col gap-4'>
//                         <div className='flex flex-col gap-3'>
//                             <Label htmlFor='header'>Header</Label>
//                             <Input id='header' defaultValue={item.header} />
//                         </div>
//                         <div className='grid grid-cols-2 gap-4'>
//                             <div className='flex flex-col gap-3'>
//                                 <Label htmlFor='type'>Type</Label>
//                                 <Select defaultValue={item.type}>
//                                     <SelectTrigger id='type' className='w-full'>
//                                         <SelectValue placeholder='Select a type' />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value='Table of Contents'>Table of Contents</SelectItem>
//                                         <SelectItem value='Executive Summary'>Executive Summary</SelectItem>
//                                         <SelectItem value='Technical Approach'>Technical Approach</SelectItem>
//                                         <SelectItem value='Design'>Design</SelectItem>
//                                         <SelectItem value='Capabilities'>Capabilities</SelectItem>
//                                         <SelectItem value='Focus Documents'>Focus Documents</SelectItem>
//                                         <SelectItem value='Narrative'>Narrative</SelectItem>
//                                         <SelectItem value='Cover Page'>Cover Page</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className='flex flex-col gap-3'>
//                                 <Label htmlFor='status'>Status</Label>
//                                 <Select defaultValue={item.status}>
//                                     <SelectTrigger id='status' className='w-full'>
//                                         <SelectValue placeholder='Select a status' />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value='Done'>Done</SelectItem>
//                                         <SelectItem value='In Progress'>In Progress</SelectItem>
//                                         <SelectItem value='Not Started'>Not Started</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                         <div className='grid grid-cols-2 gap-4'>
//                             <div className='flex flex-col gap-3'>
//                                 <Label htmlFor='target'>Target</Label>
//                                 <Input id='target' defaultValue={item.target} />
//                             </div>
//                             <div className='flex flex-col gap-3'>
//                                 <Label htmlFor='limit'>Limit</Label>
//                                 <Input id='limit' defaultValue={item.limit} />
//                             </div>
//                         </div>
//                         <div className='flex flex-col gap-3'>
//                             <Label htmlFor='reviewer'>Reviewer</Label>
//                             <Select defaultValue={item.reviewer}>
//                                 <SelectTrigger id='reviewer' className='w-full'>
//                                     <SelectValue placeholder='Select a reviewer' />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
//                                     <SelectItem value='Jamik Tashpulatov'>Jamik Tashpulatov</SelectItem>
//                                     <SelectItem value='Emily Whalen'>Emily Whalen</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </form>
//                 </div>
//                 <DrawerFooter>
//                     <Button>Submit</Button>
//                     <DrawerClose asChild>
//                         <Button variant='outline'>Done</Button>
//                     </DrawerClose>
//                 </DrawerFooter>
//             </DrawerContent>
//         </Drawer>
//     );
// }
