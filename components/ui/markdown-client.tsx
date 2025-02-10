'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <span>{children}</span>,
                ul: ({ children }) => <ul className="list-disc pl-4 my-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 my-0.5">{children}</ol>,
                li: ({ children }) => <li className="my-0">{children}</li>,
            }}
            className="leading-tight"
        >
            {markdown}
        </ReactMarkdown>
    );
}
