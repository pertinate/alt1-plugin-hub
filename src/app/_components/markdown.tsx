'use client';

import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

type Props = {
    markdown: string;
};

const safeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        // allow className on <code> so highlight.js can add language-* classes
        code: [...(defaultSchema.attributes?.code || []), ['className']],
        pre: [...(defaultSchema.attributes?.pre || []), ['className']],
    },
    // optional: explicitly allow <pre> and <code> if you run a very strict schema
    tagNames: [...(defaultSchema.tagNames || []), 'pre', 'code'],
};

export default function MarkdownRenderer(props: Props) {
    const { theme } = useTheme();

    return (
        <div className={`markdown-body p-4 ${theme === 'dark' ? 'dark' : 'light'}`}>
            <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, safeSchema], rehypeHighlight]}>
                {props.markdown}
            </ReactMarkdown>
        </div>
    );
}
