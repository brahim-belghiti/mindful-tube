'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  Download,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { getStoredContent, saveContent, clearStoredContent } from '@/lib/editorStorage';

const Editor = dynamic(() => import('./mdxEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
  ),
});

const DEBOUNCE_DELAY = 500;
const TOAST_DURATION = 3000;

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

export default function EditorSection() {
  const [markdown, setMarkdown] = useState(() => getStoredContent() || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  const debouncedSave = useCallback((content: string) => {
    setIsSaving(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveContent(content);
      setLastSaved(new Date());
      setIsSaving(false);
    }, DEBOUNCE_DELAY);
  }, []);

  const handleChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
    debouncedSave(newMarkdown);
  }, [debouncedSave]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClearNotes = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear all notes? This cannot be undone.'
      )
    ) {
      clearStoredContent();
      setMarkdown('');
      setLastSaved(null);
      showToast('Notes cleared', 'info');
    }
  }, [showToast]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) {
      showToast('Nothing to copy', 'info');
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy text:', err);
      showToast('Failed to copy', 'error');
    }
  }, [markdown, showToast]);

  const handleExport = useCallback(() => {
    if (!markdown.trim()) {
      showToast('Nothing to export', 'info');
      return;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Notes exported!', 'success');
  }, [markdown, showToast]);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <section
        className={cn(
          'transition-all duration-300 ease-in-out',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm',
          'rounded-xl shadow-xl',
          'border border-orange-300/50 dark:border-orange-500/30',
          'fixed top-4 right-4 z-50',
          'flex flex-col',
          isMinimized ? 'w-[320px]' : 'w-full lg:w-[550px]',
          isExpanded ? 'h-[60px]' : 'h-[calc(100vh-2rem)] max-h-[850px]'
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex justify-between items-center px-4 py-3',
            'border-b border-gray-200 dark:border-gray-700/50',
            'bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent'
          )}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Notes
            </h3>
            {!isExpanded && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wordCount} words
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label="Copy notes"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>

            <button
              onClick={handleExport}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label="Export notes"
              title="Export as markdown"
            >
              <Download size={16} />
            </button>

            <button
              onClick={handleClearNotes}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-red-50 dark:hover:bg-red-950/30',
                'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
              )}
              aria-label="Clear all notes"
              title="Clear notes"
            >
              <Trash2 size={16} />
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label={isMinimized ? 'Maximize editor' : 'Minimize editor'}
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label={isExpanded ? 'Collapse editor' : 'Expand editor'}
              title={isExpanded ? 'Expand' : 'Collapse'}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div
          className={cn(
            'flex-1 flex flex-col overflow-hidden transition-all duration-300',
            isExpanded ? 'opacity-0 h-0' : 'opacity-100'
          )}
        >
          <div className="flex-1 overflow-y-auto">
            <Editor markdown={markdown} onChange={handleChange} />
          </div>

          {/* Footer Status Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {isSaving && (
                <span className="text-gray-500 dark:text-gray-400">
                  Saving...
                </span>
              )}
              {lastSaved && !isSaving && (
                <span className="text-green-600 dark:text-green-400">
                  Saved at {formatTime(lastSaved)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-[100]',
            'px-4 py-3 rounded-lg shadow-lg',
            'flex items-center gap-2',
            'animate-in slide-in-from-bottom-2 fade-in duration-200',
            toast.type === 'success' && 'bg-green-500 text-white',
            toast.type === 'error' && 'bg-red-500 text-white',
            toast.type === 'info' && 'bg-gray-800 dark:bg-gray-700 text-white'
          )}
        >
          {toast.type === 'success' && <Check size={16} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}
