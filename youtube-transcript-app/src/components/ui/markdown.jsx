import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Markdown({ children, className = '' }) {
    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                // Headings
                h1: ({ ...props }) => (
                    <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ ...props }) => (
                    <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
                ),
                h3: ({ ...props }) => (
                    <h3 className="text-base font-semibold mt-2 mb-1" {...props} />
                ),
                // Paragraphs
                p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                // Lists
                ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                ),
                ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
                ),
                li: ({ ...props }) => <li className="ml-2" {...props} />,
                // Code
                code: ({ inline, ...props }) =>
                    inline ? (
                        <code
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                        />
                    ) : (
                        <code
                            className="block bg-muted p-3 rounded text-sm font-mono overflow-x-auto mb-2"
                            {...props}
                        />
                    ),
                pre: ({ ...props }) => <pre className="mb-2" {...props} />,
                // Blockquote
                blockquote: ({ ...props }) => (
                    <blockquote
                        className="border-l-4 border-primary pl-4 italic my-2"
                        {...props}
                    />
                ),
                // Links
                a: ({ ...props }) => (
                    <a className="text-primary hover:underline" {...props} />
                ),
                // Strong/Bold
                strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                // Emphasis/Italic
                em: ({ ...props }) => <em className="italic" {...props} />,
                // Horizontal Rule
                hr: ({ ...props }) => <hr className="my-4 border-border" {...props} />,
                // Tables
                table: ({ ...props }) => (
                    <div className="overflow-x-auto mb-2">
                        <table className="min-w-full border border-border" {...props} />
                    </div>
                ),
                thead: ({ ...props }) => (
                    <thead className="bg-muted" {...props} />
                ),
                th: ({ ...props }) => (
                    <th className="border border-border px-3 py-2 text-left" {...props} />
                ),
                td: ({ ...props }) => (
                    <td className="border border-border px-3 py-2" {...props} />
                ),
            }}
        >
            {children}
        </ReactMarkdown>
        </div>
    );
}
