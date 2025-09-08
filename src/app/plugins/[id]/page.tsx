import { ChevronLeft, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { HydrateClient } from '~/trpc/server';
import { remark } from 'remark';
import html from 'remark-html';
import path from 'path';
import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css/github-markdown-light.css';
import 'github-markdown-css/github-markdown-dark.css';
import MarkdownRenderer from '~/app/_components/markdown';
import Link from 'next/link';
import type { Alt1Config } from '~/lib/alt1';
import Image from 'next/image';
import { Label } from '~/components/ui/label';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // <CardTitle>RS3 Quest Buddy</CardTitle>
    //                                 <CardDescription>

    //                                 </CardDescription>
    // const fullPath = path.join('./', `test.md`);
    // const fileContents = fs.readFileSync(fullPath, 'utf8');

    const readMeContents = await (
        await fetch('https://raw.githubusercontent.com/Techpure2013/RS3QuestBuddy/refs/heads/master/README.md')
    ).text();

    const appConfigContents = (await (
        await fetch('https://techpure.dev/RS3QuestBuddy/appconfig.prod.json')
    ).json()) as Alt1Config;

    // if appconfig icon url starts with /, combine it with another url?

    // console.log(appConfigContents);

    // Use gray-matter to parse the post metadata section
    // const matterResult = matter(fileContents);
    // const processedContent = await remark().use(html).process(readMeContents);

    return (
        <HydrateClient>
            <main className='grid grid-cols-1 gap-4 md:grid-cols-5'>
                <div className='xl: col-span-4 m-4 flex flex-col gap-4 md:col-span-3'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex justify-between gap-4 border-b'>
                            <div className='flex gap-4'>
                                <Button variant={'outline'}>
                                    <Link href='/' className='flex items-center justify-center gap-2'>
                                        <ChevronLeft />
                                        Home
                                    </Link>
                                </Button>
                                <div className='flex flex-row gap-4'>
                                    <img className='h-10' src={appConfigContents.iconUrl} alt='Plugin Icon' />
                                    <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
                                        {appConfigContents.appName}
                                    </h2>
                                </div>
                            </div>
                            <Button variant={'outline'} asChild>
                                <Link href={``}>Edit</Link>
                            </Button>
                        </div>
                        <p className='text-muted-foreground text-sm'>{appConfigContents.description}</p>
                    </div>
                    <Card className='overflow-hidden p-0'>
                        <MarkdownRenderer markdown={readMeContents} />
                    </Card>
                </div>
                <div className='m-4 flex flex-col gap-4 md:col-span-2'>
                    <Card>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4'>
                                <Button>Install</Button>
                                <div
                                    // onValueChange={setValue}
                                    className='flex items-center justify-center space-x-6'
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
                                                'down' === 'down' ? 'bg-red-500 text-white' : 'hover:bg-muted'
                                            }`}
                                        >
                                            <ThumbsDown className='h-5 w-5' />
                                        </button>
                                        <span className='absolute -bottom-5 text-sm font-medium'>{5}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Plugin Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <Label className='text-md font-extrabold'>Author</Label>
                                    <Label className='text-xlg font-extralight'>Techpure</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <Button variant={'outline'}>Github</Button>
                                <Button variant={'outline'}>Discord</Button>
                                <Button variant={'outline'}>Forum</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </HydrateClient>
    );
}
