import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import css from "./markdown.module.css";

interface MarkdownProps {
    markdown: string;
}

const Markdown = async ({ markdown }: MarkdownProps) => {

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} className={css.markdown}>
            {markdown}
        </ReactMarkdown>
    )

}

export { Markdown };