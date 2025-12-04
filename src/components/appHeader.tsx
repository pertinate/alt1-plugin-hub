import { addPluginHubLink } from '~/lib/alt1';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import Link from 'next/link';
import { auth } from '~/server/auth';
import { SignOutBtn } from './signOutBtn';
import AddToAlt1 from './addToAlt1';
import OpenInBrowser from './openInBrowser';
import { SetNickName } from './setNickName';

export const AppHeader = async () => {
    const session = await auth();
    return (
        <div className='flex items-center justify-between px-2 pt-2'>
            <Link href='/'>
                <h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
                    Plugin Hub
                </h1>
            </Link>

            <div className='flex gap-2'>
                <Button variant={'outline'} asChild>
                    <Link href={'/plugins'}>My Repos</Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'}>Help</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={'https://discord.gg/VKkmzhhj'} target='_blank' rel='noopener noreferrer'>
                                Discord
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={'https://discord.gg/AKWKmAPg'} target='_blank' rel='noopener noreferrer'>
                                Alt1 Discord
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <AddToAlt1 />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <OpenInBrowser />
                        </DropdownMenuItem>
                        {session && <SetNickName />}
                    </DropdownMenuContent>
                </DropdownMenu>
                <ThemeToggle />
                {session && <SignOutBtn />}
            </div>
        </div>
    );
};
