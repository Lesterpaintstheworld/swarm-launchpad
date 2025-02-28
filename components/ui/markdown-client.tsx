'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    return (
        <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
}
