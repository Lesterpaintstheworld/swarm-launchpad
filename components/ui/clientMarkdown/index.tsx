'use client';

import ReactMarkdown from 'react-markdown';

interface ClientMarkdownProps {
  markdown: string;
}

export function ClientMarkdown({ markdown }: ClientMarkdownProps) {
  return (
    <ReactMarkdown>
      {markdown}
    </ReactMarkdown>
  );
}
