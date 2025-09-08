import { ChevronLeft, GalleryVerticalEnd, HomeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '~/components/data-table';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { HydrateClient } from '~/trpc/server';

export default async function Page() {
    return (
        <HydrateClient>
            <main className='flex grow flex-col items-center justify-center gap-6 p-6 md:p-10'></main>
        </HydrateClient>
    );
}
