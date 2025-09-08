import Link from 'next/link';

import { LatestPost } from '~/app/_components/post';
import { ThemeToggle } from '~/components/theme-toggle';
import { Button } from '~/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '~/components/ui/context-menu';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { addPluginHubLink } from '~/lib/alt1';
import { auth } from '~/server/auth';
import { api, HydrateClient } from '~/trpc/server';
import { ArrowDown, ArrowUp, ThumbsDown, ThumbsUp } from 'lucide-react';
import { headers } from 'next/headers';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';

export default async function Home() {
    // const session = await auth();
    // console.log(pathname);
    // const repos = await api.github.getRepos();
    // const appConfig = await api.github.getAppConfig({repo: 'alt1-safecracking-timer'});

    // if (session?.user) {
    //     void api.post.getLatest.prefetch();
    //     // void api.github.getRepos.prefetch();
    //     // void api.github.getAppConfig.prefetch({repo: 'alt1-safecracking-timer'});
    // }
    const BannerWrapper: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
        <div className='relative inline-block'>
            <div className='absolute top-0 left-0 rotate-[-15deg] bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                {text}
            </div>
            {children}
        </div>
    );

    return (
        <HydrateClient>
            <main className='flex shrink-0 grow-1 flex-col'>
                <div className='flex flex-col gap-4 px-8 py-4'>
                    <div className='flex items-center justify-center'>
                        <div className='flex max-w-sm gap-2'>
                            <Input type='search' id='search' placeholder='Search...' />
                        </div>
                    </div>
                    <Card className='p-2'>
                        <Collapsible>
                            <CollapsibleTrigger className='w-full'>
                                <CardHeader>
                                    <CardTitle>Top Plugins</CardTitle>
                                </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className='m-0 p-0'>
                                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                                        <BannerWrapper text='Month'>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>RS3 Quest Buddy</CardTitle>
                                                    <CardDescription>
                                                        Brings questing right into your RS3 environment by giving you
                                                        steps to quest completion. I have to give thanks to everyone who
                                                        contributed images for quests. Contributors To Code: Ex Inferi
                                                    </CardDescription>
                                                    <CardAction>
                                                        <Button asChild>
                                                            <Link href='#'>View</Link>
                                                        </Button>
                                                    </CardAction>
                                                </CardHeader>
                                                <CardFooter>
                                                    <div className='flex w-full justify-between gap-2'>
                                                        <div
                                                            // onValueChange={setValue}
                                                            className='flex items-center space-x-6'
                                                        >
                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('up')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        'up' === 'up'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsUp className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {10}
                                                                </span>
                                                            </div>

                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('down')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        '' === 'down'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsDown className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {5}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* <Button asChild>
                                        <Link href='#'>Support</Link>
                                    </Button> */}
                                                        <Button>Install</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </BannerWrapper>
                                        <BannerWrapper text='Week'>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>RS3 Quest Buddy</CardTitle>
                                                    <CardDescription>
                                                        Brings questing right into your RS3 environment by giving you
                                                        steps to quest completion. I have to give thanks to everyone who
                                                        contributed images for quests. Contributors To Code: Ex Inferi
                                                    </CardDescription>
                                                    <CardAction>
                                                        <Button asChild>
                                                            <Link href='#'>View</Link>
                                                        </Button>
                                                    </CardAction>
                                                </CardHeader>
                                                <CardFooter>
                                                    <div className='flex w-full justify-between gap-2'>
                                                        <div
                                                            // onValueChange={setValue}
                                                            className='flex items-center space-x-6'
                                                        >
                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('up')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        'up' === 'up'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsUp className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {10}
                                                                </span>
                                                            </div>

                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('down')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        '' === 'down'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsDown className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {5}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* <Button asChild>
                                        <Link href='#'>Support</Link>
                                    </Button> */}
                                                        <Button>Install</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </BannerWrapper>
                                        <BannerWrapper text='Today'>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>RS3 Quest Buddy</CardTitle>
                                                    <CardDescription>
                                                        Brings questing right into your RS3 environment by giving you
                                                        steps to quest completion. I have to give thanks to everyone who
                                                        contributed images for quests. Contributors To Code: Ex Inferi
                                                    </CardDescription>
                                                    <CardAction>
                                                        <Button asChild>
                                                            <Link href='#'>View</Link>
                                                        </Button>
                                                    </CardAction>
                                                </CardHeader>
                                                <CardFooter>
                                                    <div className='flex w-full justify-between gap-2'>
                                                        <div
                                                            // onValueChange={setValue}
                                                            className='flex items-center space-x-6'
                                                        >
                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('up')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        'up' === 'up'
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsUp className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {10}
                                                                </span>
                                                            </div>

                                                            <div className='relative flex flex-col items-center'>
                                                                <button
                                                                    // onClick={() => handleVote('down')}
                                                                    className={`rounded-full p-2 transition-colors ${
                                                                        '' === 'down'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'hover:bg-muted'
                                                                    }`}
                                                                >
                                                                    <ThumbsDown className='h-5 w-5' />
                                                                </button>
                                                                <span className='absolute -bottom-5 text-sm font-medium'>
                                                                    {5}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* <Button asChild>
                                        <Link href='#'>Support</Link>
                                    </Button> */}
                                                        <Button>Install</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </BannerWrapper>
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>RS3 Quest Buddy</CardTitle>
                                <CardDescription>
                                    Brings questing right into your RS3 environment by giving you steps to quest
                                    completion. I have to give thanks to everyone who contributed images for quests.
                                    Contributors To Code: Ex Inferi
                                </CardDescription>
                                <CardAction>
                                    <Button asChild>
                                        <Link href='#'>View</Link>
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardFooter>
                                <div className='flex w-full justify-between gap-2'>
                                    <div
                                        // onValueChange={setValue}
                                        className='flex items-center space-x-6'
                                    >
                                        <div className='relative flex flex-col items-center'>
                                            <button
                                                // onClick={() => handleVote('up')}
                                                className={`rounded-full p-2 transition-colors ${
                                                    'up' === 'up' ? 'bg-green-500 text-white' : 'hover:bg-muted'
                                                }`}
                                            >
                                                <ThumbsUp className='h-5 w-5' />
                                            </button>
                                            <span className='absolute -bottom-5 text-sm font-medium'>{10}</span>
                                        </div>

                                        <div className='relative flex flex-col items-center'>
                                            <button
                                                // onClick={() => handleVote('down')}
                                                className={`rounded-full p-2 transition-colors ${
                                                    '' === 'down' ? 'bg-red-500 text-white' : 'hover:bg-muted'
                                                }`}
                                            >
                                                <ThumbsDown className='h-5 w-5' />
                                            </button>
                                            <span className='absolute -bottom-5 text-sm font-medium'>{5}</span>
                                        </div>
                                    </div>
                                    {/* <Button asChild>
                                        <Link href='#'>Support</Link>
                                    </Button> */}
                                    <Button>Install</Button>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>RS3 Quest Buddy</CardTitle>
                                <CardDescription>
                                    Brings questing right into your RS3 environment by giving you steps to quest
                                    completion. I have to give thanks to everyone who contributed images for quests.
                                    Contributors To Code: Ex Inferi
                                </CardDescription>
                                <CardAction>
                                    <Button asChild>
                                        <Link href='/plugins/blah'>View</Link>
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardFooter>
                                <div className='flex w-full justify-between gap-2'>
                                    <div
                                        // onValueChange={setValue}
                                        className='flex items-center space-x-6'
                                    >
                                        <div className='relative flex flex-col items-center'>
                                            <button
                                                // onClick={() => handleVote('up')}
                                                className={`rounded-full p-2 transition-colors ${
                                                    '' === 'up' ? 'bg-green-500 text-white' : 'hover:bg-muted'
                                                }`}
                                            >
                                                <ThumbsUp className='h-5 w-5' />
                                            </button>
                                            <span className='absolute -bottom-5 text-sm font-medium'>{10}</span>
                                        </div>

                                        <div className='relative flex flex-col items-center'>
                                            <button
                                                // onClick={() => handleVote('down')}
                                                className={`rounded-full p-2 transition-colors ${
                                                    'down' === 'down' ? 'bg-red-500 text-white' : 'hover:bg-muted'
                                                }`}
                                            >
                                                <ThumbsDown className='h-5 w-5' />
                                            </button>
                                            <span className='absolute -bottom-5 text-sm font-medium'>{5}</span>
                                        </div>
                                    </div>
                                    {/* <Button asChild>
                                        <Link href='#'>Support</Link>
                                    </Button> */}
                                    <Button asChild>
                                        <Link href=''>Install</Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
            {/* <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
                <div className='container flex flex-col items-center justify-center gap-12 px-4 py-16'>
                    
                    {/* {
                        (repos as any[]).map(entry => (
                            <div key={entry.id}>
                                <div><img width={50} src={entry.owner.avatar_url}/>{entry.owner.login}</div>
                                <div>{entry.name}</div>
                            </div>
                        ))
                    }
                    <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>
                        Create <span className='text-[hsl(280,100%,70%)]'>T3</span> App
                    </h1>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8'>
                        <Link
                            className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20'
                            href='https://create.t3.gg/en/usage/first-steps'
                            target='_blank'
                        >
                            <h3 className='text-2xl font-bold'>First Steps →</h3>
                            <div className='text-lg'>
                                Just the basics - Everything you need to know to set up your database and
                                authentication.
                            </div>
                        </Link>
                        <Link
                            className='flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20'
                            href='https://create.t3.gg/en/introduction'
                            target='_blank'
                        >
                            <h3 className='text-2xl font-bold'>Documentation →</h3>
                            <div className='text-lg'>
                                Learn more about Create T3 App, the libraries it uses, and how to deploy it.
                            </div>
                        </Link>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <p className='text-2xl text-white'>{hello ? hello.greeting : 'Loading tRPC query...'}</p>

                        <div className='flex flex-col items-center justify-center gap-4'>
                            <p className='text-center text-2xl text-white'>
                                {session && <span>Logged in as {session.user?.username}</span>}
                            </p>
                            <Link
                                href={session ? '/api/auth/signout' : '/api/auth/signin'}
                                className='rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20'
                            >
                                {session ? 'Sign out' : 'Sign in'}
                            </Link>
                        </div>
                    </div>

                    {session?.user && <LatestPost />}
                </div>
            </main> */}
        </HydrateClient>
    );
}
