'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

export function ProofDisplay({ content }: { content: string }) {
  if (!content) {
    return null;
  }
  return (
    <ReactMarkdown
      className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed"
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
    >
      {content}
    </ReactMarkdown>
  );
}
