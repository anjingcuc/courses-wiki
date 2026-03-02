'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
  darkMode?: boolean;
}

export function CodeBlock({ language, code, darkMode = false }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={darkMode ? oneDark : oneLight}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.9rem',
      }}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  );
}
