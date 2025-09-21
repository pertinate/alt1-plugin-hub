import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from './ui/card';
import { Votes } from './votes';
import type { RouterOutputs } from '~/trpc/react';
import type { Alt1Config } from '~/lib/alt1';
import { getBaseUrl } from '~/util/baseUrl';
import Link from 'next/link';

type Props = {
    data: RouterOutputs['votes']['getVotes'];
    appConfig: Alt1Config;
};

export const PluginCard = ({ data, appConfig }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data?.name}</CardTitle>
                <CardDescription>{appConfig.description}</CardDescription>
                <CardAction>
                    <Button asChild>
                        <Link href={`${getBaseUrl()}/plugins/${data?.pluginId}`}>View</Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <CardFooter>
                <div className='flex w-full justify-between gap-2'>
                    <Votes id={data?.pluginId ?? -1} />

                    <Button asChild>
                        <Link href={`alt1://addapp/${data?.appConfig}`}>Install</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
