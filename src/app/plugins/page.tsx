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
import { api, HydrateClient } from '~/trpc/server';
import { PluginTable } from '../_components/pluginTable';
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';
import { CreatePlugin } from '~/components/createPlugin';

export default async function Page() {
    const session = await auth();

    if (!session) {
        // This will redirect on the server
        redirect('/api/auth/signin'); // or "/api/auth/signin" if using next-auth
    }

    void (await api.plugin.getCreatedPlugins.prefetch());

    return (
        <HydrateClient>
            <main className='flex grow flex-col items-center justify-center gap-6 p-6 md:p-10'>
                <div className='flex w-full items-center justify-between px-4 lg:px-6'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={'/'}>
                            <HomeIcon />
                            <span className='hidden lg:inline'>Home</span>
                        </Link>
                    </Button>
                    <CreatePlugin />
                </div>
                <PluginTable />
            </main>
        </HydrateClient>
    );
    // return <div>My Post: {name}</div>;
}
