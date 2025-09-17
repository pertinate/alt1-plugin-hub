'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { api } from '~/trpc/react';
import Link from 'next/link';

type Props = {
    id: number;
    up: number;
    down: number;
    userVote: number;
    appConfig: string;
};

export const Votes = ({ id, up, down, userVote }: Props) => {
    const utils = api.useUtils();
    const vote = api.votes.manage.useMutation({
        onSuccess: () => {
            utils.votes.invalidate();
            utils.plugin.invalidate();
        },
    });
    return (
        <div className='flex w-full justify-between gap-2'>
            <div
                // onValueChange={setValue}
                className='flex items-center space-x-6'
            >
                <div className='relative flex flex-col items-center'>
                    <button
                        disabled={vote.isPending}
                        onClick={() => {
                            if (userVote !== 1) {
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
                        className={`rounded-full p-2 transition-colors ${
                            userVote === 1 ? 'bg-green-500 text-white' : 'hover:bg-muted'
                        }`}
                    >
                        <ThumbsUp className='h-5 w-5' />
                    </button>
                    <span className='absolute -bottom-5 text-sm font-medium'>{up}</span>
                </div>

                <div className='relative flex flex-col items-center'>
                    <button
                        disabled={vote.isPending}
                        onClick={() => {
                            if (userVote !== -1) {
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
                        className={`rounded-full p-2 transition-colors ${
                            userVote === -1 ? 'bg-red-500 text-white' : 'hover:bg-muted'
                        }`}
                    >
                        <ThumbsDown className='h-5 w-5' />
                    </button>
                    <span className='absolute -bottom-5 text-sm font-medium'>{down}</span>
                </div>
            </div>
        </div>
    );
};
