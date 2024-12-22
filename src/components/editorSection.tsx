'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./MdxEditor'), {
  loading: () => (
    <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700" />
  ),
});

export default function EditorSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <section
      className={`
        transition-all duration-300 ease-in-out
        bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-orange-300
        ${isMinimized ? 'w-[300px]' : 'w-full lg:w-1/2'}
        ${
          isExpanded
            ? 'h-[calc(100vh-2rem)] max-h-[800px] '
            : 'h-[60px] overflow-hidden'
        }
        fixed top-4 right-4 z-50
      `}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold">Start taking notes</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label={isMinimized ? 'Maximize editor' : 'Minimize editor'}
          >
            {isMinimized ? (
              <Maximize2 size={20} />
            ) : (
              <Minimize2 size={20} />
            )}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label={isExpanded ? 'Collapse editor' : 'Expand editor'}
          >
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isExpanded && <Editor />}
      </div>
    </section>
  );
}