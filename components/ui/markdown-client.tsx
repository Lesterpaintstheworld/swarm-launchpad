'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    // Replace single newlines with double newlines for proper breaks
    const formattedMarkdown = markdown.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
    
    return (
        <ReactMarkdown>
            {formattedMarkdown}
        </ReactMarkdown>
    );
}
