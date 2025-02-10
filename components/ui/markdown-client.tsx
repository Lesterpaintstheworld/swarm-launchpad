'use client';

interface MarkdownClientProps {
    markdown: string;
}

export function MarkdownClient({ markdown }: MarkdownClientProps) {
    const formatMarkdown = (content: string) => {
        return content.split('\n').map((line, i) => {
            // Handle bullet points
            if (line.startsWith('- ')) {
                return (
                    <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 mt-1.5 flex-shrink-0" />
                        <span>{line.slice(2)}</span>
                    </div>
                );
            }
            // Regular lines
            return line ? (
                <div key={i}>{line}</div>
            ) : (
                <div key={i} className="h-[0.5em]" />
            );
        });
    };

    return (
        <div className="space-y-0.5">
            {formatMarkdown(markdown)}
        </div>
    );
}
