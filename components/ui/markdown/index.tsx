'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
    markdown: string;
}

export function Markdown({ markdown }: MarkdownProps) {
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
}
