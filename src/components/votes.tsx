'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '~/trpc/react';
import Link from 'next/link';
import { Loading } from './loading';
import { useSession } from 'next-auth/react';
import { cn } from '~/lib/utils';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner';

type Props = {
    id: number;
};

export const Votes = ({ id }: Props) => {
    const session = useSession();
    const utils = api.useUtils();
    const vote = api.votes.manage.useMutation({
        onSuccess: () => {
            utils.votes.invalidate();
            utils.plugin.invalidate();
        },
    });

    const votes = api.votes.getVotes.useQuery(id);
    return (
        <Card className='overflow-hidden p-0'>
            <Loading loading={votes.isPending || vote.isPending}>
                <CardContent className='p-2'>
                    <div className='flex items-center space-x-6'>
                        <div className='relative flex flex-col items-center'>
                            <button
                                disabled={vote.isPending}
                                onClick={() => {
                                    if (session.status !== 'authenticated') {
                                        toast('Please log in to vote for a plugin.');
                                        return;
                                    }
                                    if (votes.data?.userVote !== 1) {
                                        vote.mutate({
                                            id,
                                            value: 1,
                                        });
                                    } else {
                                        vote.mutate({
                                            id,
                                            value: 0,
                                        });
                                    }
                                }}
                                className={cn(
                                    'rounded-full p-2 transition-colors',
                                    votes.data?.userVote === 1 ? 'text-green-500' : 'hover:bg-muted'
                                )}
                            >
                                <ThumbsUp className='h-5 w-5' />
                            </button>
                            <span className='text-sm font-medium'>{votes.data?.upvotes}</span>
                        </div>

                        <div className='relative flex flex-col items-center'>
                            <button
                                disabled={vote.isPending}
                                onClick={() => {
                                    if (session.status !== 'authenticated') {
                                        toast('Please log in to vote for a plugin. Click "My Repos" to log in.');
                                        return;
                                    }
                                    if (votes.data?.userVote !== -1) {
                                        vote.mutate({
                                            id,
                                            value: -1,
                                        });
                                    } else {
                                        vote.mutate({
                                            id,
                                            value: 0,
                                        });
                                    }
                                }}
                                className={cn(
                                    'rounded-full p-2 transition-colors',
                                    votes.data?.userVote === -1 ? 'text-red-500' : 'hover:bg-muted'
                                )}
                            >
                                <ThumbsDown className='h-5 w-5' />
                            </button>
                            <span className='text-sm font-medium'>{votes.data?.downvotes}</span>
                        </div>
                    </div>
                </CardContent>
            </Loading>
        </Card>
    );
};
