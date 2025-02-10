'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    return (
        <ReactMarkdown
            className="prose prose-invert prose-sm max-w-none"
            components={{
                p: ({ children }) => (
                    <p className="my-1">{children}</p>
                ),
                pre: ({ children }) => (
                    <pre className="my-1">{children}</pre>
                ),
                ul: ({ children }) => (
                    <ul className="my-1 list-disc pl-4">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="my-1 list-decimal pl-4">{children}</ol>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
}
