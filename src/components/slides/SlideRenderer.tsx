'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';

interface SlideRendererProps {
  content: string;
}

export function SlideRenderer({ content }: SlideRendererProps) {
  // Process style markers
  const processed = processContent(content);

  return (
    <div className="prose prose-lg max-w-none slide-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className?.includes('block');

            if (isInline) {
              return (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : 'text'}
                code={String(children).replace(/\n$/, '')}
              />
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                loading="lazy"
                {...props}
              />
            );
          },
          video({ src, ...props }) {
            return (
              <video
                src={src}
                controls
                className="max-w-full h-auto rounded-lg"
                {...props}
              />
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-center mb-8">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-medium mb-4">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-lg leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-lg">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

function processContent(content: string): string {
  // Remove our style markers for now (could be enhanced later)
  return content.replace(/\{:style="[^"]+"\}/g, '');
}
