'use client';

import MarkdownRenderer from '~/app/_components/markdown';
import { Card } from './ui/card';

type Props = {
    contents: string;
};

export default function MDRender(props: Props) {
    return (
        <Card className='overflow-hidden p-0'>
            <MarkdownRenderer markdown={props.contents} />
        </Card>
    );
}
