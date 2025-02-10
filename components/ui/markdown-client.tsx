'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => (
                    <span className="block">{children}</span>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc pl-4">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-4">{children}</ol>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
}
