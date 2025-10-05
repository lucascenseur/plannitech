"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const parseMarkdown = (text: string): ReactNode[] => {
    const lines = text.split('\n');
    const elements: ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        elements.push(<br key={key++} />);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
            {parseInlineMarkdown(line.substring(2))}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-3xl font-bold text-gray-900 mb-5 mt-7">
            {parseInlineMarkdown(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">
            {parseInlineMarkdown(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={key++} className="text-xl font-semibold text-gray-800 mb-3 mt-5">
            {parseInlineMarkdown(line.substring(5))}
          </h4>
        );
      } else if (line.startsWith('##### ')) {
        elements.push(
          <h5 key={key++} className="text-lg font-medium text-gray-700 mb-3 mt-4">
            {parseInlineMarkdown(line.substring(6))}
          </h5>
        );
      } else if (line.startsWith('###### ')) {
        elements.push(
          <h6 key={key++} className="text-base font-medium text-gray-700 mb-2 mt-3">
            {parseInlineMarkdown(line.substring(7))}
          </h6>
        );
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: ReactNode[] = [];
        let j = i;
        
        while (j < lines.length && (lines[j].startsWith('- ') || lines[j].startsWith('* ') || lines[j].trim() === '')) {
          if (lines[j].startsWith('- ') || lines[j].startsWith('* ')) {
            listItems.push(
              <li key={j} className="mb-2 text-gray-700 leading-relaxed">
                {parseInlineMarkdown(lines[j].substring(2))}
              </li>
            );
          }
          j++;
        }
        
        elements.push(
          <ul key={key++} className="list-disc list-inside mb-6 space-y-2 ml-4">
            {listItems}
          </ul>
        );
        i = j - 1;
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const listItems: ReactNode[] = [];
        let j = i;
        
        while (j < lines.length && (/^\d+\.\s/.test(lines[j]) || lines[j].trim() === '')) {
          if (/^\d+\.\s/.test(lines[j])) {
            listItems.push(
              <li key={j} className="mb-2 text-gray-700 leading-relaxed">
                {parseInlineMarkdown(lines[j].replace(/^\d+\.\s/, ''))}
              </li>
            );
          }
          j++;
        }
        
        elements.push(
          <ol key={key++} className="list-decimal list-inside mb-6 space-y-2 ml-4">
            {listItems}
          </ol>
        );
        i = j - 1;
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        const blockquoteLines: string[] = [];
        let j = i;
        
        while (j < lines.length && (lines[j].startsWith('> ') || lines[j].trim() === '')) {
          if (lines[j].startsWith('> ')) {
            blockquoteLines.push(lines[j].substring(2));
          }
          j++;
        }
        
        elements.push(
          <blockquote key={key++} className="border-l-4 border-blue-500 pl-6 py-2 mb-6 bg-blue-50 italic text-gray-700">
            {blockquoteLines.map((quoteLine, idx) => (
              <p key={idx} className="mb-2 last:mb-0">
                {parseInlineMarkdown(quoteLine)}
              </p>
            ))}
          </blockquote>
        );
        i = j - 1;
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        let j = i + 1;
        
        while (j < lines.length && !lines[j].startsWith('```')) {
          codeLines.push(lines[j]);
          j++;
        }
        
        elements.push(
          <pre key={key++} className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-6">
            <code className="text-sm">
              {codeLines.join('\n')}
            </code>
          </pre>
        );
        i = j;
      }
      // Horizontal rules
      else if (line === '---' || line === '***' || line === '___') {
        elements.push(
          <hr key={key++} className="my-8 border-gray-300" />
        );
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={key++} className="mb-6 text-gray-700 leading-relaxed text-lg">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): ReactNode => {
    const parts: ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Bold text **text** or __text__
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }
      
      // Add bold text
      parts.push(
        <strong key={key++} className="font-bold text-gray-900">
          {parseInlineMarkdown(match[2])}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    // Italic text *text* or _text_
    const italicRegex = /(\*|_)(.*?)\1/g;
    currentIndex = 0;
    const newParts: ReactNode[] = [];
    
    for (const part of parts) {
      if (typeof part === 'string') {
        let partIndex = 0;
        let partKey = 0;
        
        while ((match = italicRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > partIndex) {
            newParts.push(part.slice(partIndex, match.index));
          }
          
          // Add italic text
          newParts.push(
            <em key={partKey++} className="italic text-gray-800">
              {match[2]}
            </em>
          );
          
          partIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (partIndex < part.length) {
          newParts.push(part.slice(partIndex));
        }
      } else {
        newParts.push(part);
      }
    }

    // Links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const finalParts: ReactNode[] = [];
    currentIndex = 0;
    
    for (const part of newParts) {
      if (typeof part === 'string') {
        let partIndex = 0;
        let partKey = 0;
        
        while ((match = linkRegex.exec(part)) !== null) {
          // Add text before the match
          if (match.index > partIndex) {
            finalParts.push(part.slice(partIndex, match.index));
          }
          
          // Add link
          finalParts.push(
            <a 
              key={partKey++} 
              href={match[2]} 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {match[1]}
            </a>
          );
          
          partIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (partIndex < part.length) {
          finalParts.push(part.slice(partIndex));
        }
      } else {
        finalParts.push(part);
      }
    }

    return <>{finalParts}</>;
  };

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {parseMarkdown(content)}
    </div>
  );
}

