'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '~/trpc/react';
import Link from 'next/link';
import { Loading } from './loading';
import { useSession } from 'next-auth/react';
import { cn } from '~/lib/utils';

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
        <div className='flex justify-between gap-2'>
            <Loading loading={votes.isPending || vote.isPending}>
                <div
                    // onValueChange={setValue}
                    className='flex items-center space-x-6'
                >
                    <div className='relative flex flex-col items-center'>
                        <button
                            disabled={vote.isPending || session.status != 'authenticated'}
                            onClick={() => {
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
                                votes.data?.userVote === 1 ? 'bg-green-500 text-white' : 'hover:bg-muted',
                                session.status !== 'authenticated' && 'pointer-events-none'
                            )}
                        >
                            <ThumbsUp className='h-5 w-5' />
                        </button>
                        <span className='absolute -bottom-5 text-sm font-medium'>{votes.data?.upvotes}</span>
                    </div>

                    <div className='relative flex flex-col items-center'>
                        <button
                            disabled={vote.isPending || session.status != 'authenticated'}
                            onClick={() => {
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
                                votes.data?.userVote === -1 ? 'bg-red-500 text-white' : 'hover:bg-muted',
                                session.status !== 'authenticated' && 'pointer-events-none'
                            )}
                        >
                            <ThumbsDown className='h-5 w-5' />
                        </button>
                        <span className='absolute -bottom-5 text-sm font-medium'>{votes.data?.downvotes}</span>
                    </div>
                </div>
            </Loading>
        </div>
    );
};
