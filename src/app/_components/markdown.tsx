'use client';

import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

type Props = {
    markdown: string;
};

export default function MarkdownRenderer(props: Props) {
    const { theme } = useTheme();

    return (
        <div className={`markdown-body p-4 ${theme === 'dark' ? 'dark' : 'light'}`}>
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>{props.markdown}</ReactMarkdown>
        </div>
    );
}
