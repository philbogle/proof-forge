// src/components/proof-display.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Regex to find the custom collapsible syntax
const detailsRegex = /(?<=\n|\A)\?\?\?(\+)?\s+(note|warning|tip)\s+"([^"]+)"\n([\s\S]*?)(?=\n\?\?\?|\n\n\n|$)/g;

interface ParsedSegment {
  type: 'markdown' | 'details';
  content: string;
  title?: string;
}

export function ProofDisplay({ content }: { content: string }) {
  if (!content) {
    return null;
  }

  const parsedSegments: ParsedSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = detailsRegex.exec(content)) !== null) {
    const [fullMatch, , , title, innerContent] = match;
    
    // Add the markdown content before this match
    if (match.index > lastIndex) {
      parsedSegments.push({
        type: 'markdown',
        content: content.substring(lastIndex, match.index),
      });
    }

    // Add the details block
    parsedSegments.push({
      type: 'details',
      title: title,
      content: innerContent.trim(),
    });

    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining markdown content after the last match
  if (lastIndex < content.length) {
    parsedSegments.push({
      type: 'markdown',
      content: content.substring(lastIndex),
    });
  }

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
      {parsedSegments.map((segment, index) => {
        if (segment.type === 'details' && segment.title) {
          return (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className='my-0 py-0 border-b-0'>
                <AccordionTrigger className='py-2 text-base font-semibold hover:no-underline'>{segment.title}</AccordionTrigger>
                <AccordionContent>
                   <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                    >
                      {segment.content}
                    </ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
        return (
           <ReactMarkdown
              key={index}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeKatex]}
            >
              {segment.content}
            </ReactMarkdown>
        );
      })}
    </div>
  );
}
