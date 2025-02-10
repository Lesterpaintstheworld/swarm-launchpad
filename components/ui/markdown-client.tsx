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
                ul: ({ children }) => <ul className="list-disc pl-4 -mt-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 -mt-2">{children}</ol>,
                li: ({ children }) => <li className="leading-none py-0.5">{children}</li>,
            }}
            className="leading-none"
        >
            {markdown}
        </ReactMarkdown>
    );
}
