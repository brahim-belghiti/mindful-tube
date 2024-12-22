'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Minimize2, Maximize2, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./mdxEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700" />
  ),
});

const STORAGE_KEY = 'editor-content';


export default function EditorSection() {
  // Initialize states from localStorage if available
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor-expanded') !== 'false';
    }
    return true;
  });
  
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor-minimized') === 'true';
    }
    return false;
  });

  const [isCopied, setIsCopied] = useState(false);

  const handleExpand = (expanded: boolean) => {
    setIsExpanded(expanded);
    localStorage.setItem('editor-expanded', String(expanded));
  };

  const handleMinimize = (minimized: boolean) => {
    setIsMinimized(minimized);
    localStorage.setItem('editor-minimized', String(minimized));
  };

  const handleClearNotes = () => {
    if (window.confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleCopy = async () => {
    const content = localStorage.getItem(STORAGE_KEY);
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <section
      className={cn(
        "transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-900",
        "rounded-lg shadow-lg",
        "border border-orange-300",
        "fixed top-4 right-4 z-50",
        isMinimized ? "w-[300px]" : "w-full lg:w-1/2",
        isExpanded 
          ? "h-[calc(100vh-2rem)] max-h-[800px]"
          : "h-[60px] overflow-hidden"
      )}
    >
      <div className={cn(
        "flex justify-between items-center p-4",
        "border-b dark:border-gray-700"
      )}>
        <h3 className="text-lg font-semibold">notes</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-full transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              isCopied && "text-green-500"
            )}
            aria-label="Copy notes"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={handleClearNotes}
            className={cn(
              "p-2 rounded-full transition-colors text-red-500",
              "hover:bg-red-100 dark:hover:bg-red-900/20"
            )}
            aria-label="Clear all notes"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => handleMinimize(!isMinimized)}
            className={cn(
              "p-2 rounded-full transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            aria-label={isMinimized ? 'Maximize editor' : 'Minimize editor'}
          >
            {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
          </button>
          <button
            onClick={() => handleExpand(!isExpanded)}
            className={cn(
              "p-2 rounded-full transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            aria-label={isExpanded ? 'Collapse editor' : 'Expand editor'}
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0 h-0"
        )}
      >
        <Editor />
      </div>
    </section>
  );
}