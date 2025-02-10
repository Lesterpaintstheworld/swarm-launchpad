'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <span className="block leading-none">{children}</span>,
                ul: ({ children }) => <ul className="list-disc pl-4 my-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 my-0">{children}</ol>,
                li: ({ children }) => <li className="my-0">{children}</li>,
            }}
            className="space-y-0.5"
        >
            {markdown}
        </ReactMarkdown>
    );
}
