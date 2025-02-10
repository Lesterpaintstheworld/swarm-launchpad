'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    // Split the markdown into lines and process each line
    const lines = markdown.split('\n');
    
    return (
        <div className="space-y-1">
            {lines.map((line, index) => (
                <div key={index}>
                    {line.trim() && (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <span>{children}</span>,
                                ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4">{children}</ol>,
                                li: ({ children }) => <li className="ml-2">{children}</li>,
                            }}
                        >
                            {line}
                        </ReactMarkdown>
                    )}
                </div>
            ))}
        </div>
    );
}
