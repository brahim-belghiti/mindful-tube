'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Check,
  Download,
  FileText,
  Eye,
  Pencil,
  Pin,
  PinOff,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { getStoredContent, saveContent, clearStoredContent, getPanelState, savePanelState } from '@/lib/editorStorage';
import { marked } from 'marked';

const Editor = dynamic(() => import('./mdxEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
  ),
});

const DEBOUNCE_DELAY = 500;
const TOAST_DURATION = 3000;
const MIN_WIDTH = 300;
const MAX_WIDTH = 800;

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

export default function EditorSection() {
  const initialPanelState = useMemo(() => getPanelState(), []);

  const [markdown, setMarkdown] = useState(() => getStoredContent() || '');
  const [isExpanded, setIsExpanded] = useState(initialPanelState.isExpanded);
  const [width, setWidth] = useState(initialPanelState.width);
  const [isPinned, setIsPinned] = useState(initialPanelState.isPinned);
  const [isPreview, setIsPreview] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

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

  const forceSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    saveContent(markdown);
    setLastSaved(new Date());
    setIsSaving(false);
    showToast('Notes saved!', 'success');
  }, [markdown, showToast]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    savePanelState({ isExpanded, width, isPinned });
  }, [isExpanded, width, isPinned]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 's') {
        e.preventDefault();
        forceSave();
      }

      if (modifier && e.key === 'e') {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }

      if (modifier && e.key === 'p') {
        e.preventDefault();
        setIsPreview((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forceSave]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, MIN_WIDTH), MAX_WIDTH);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = useCallback(() => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
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

  const renderedMarkdown = useMemo(() => {
    return marked.parse(markdown);
  }, [markdown]);

  return (
    <>
      <section
        className={cn(
          'transition-shadow duration-200',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm',
          'rounded-l-xl shadow-xl',
          'border-y border-l border-orange-300/50 dark:border-orange-500/30',
          'fixed top-4 right-0 z-50',
          'flex flex-col',
          isExpanded ? 'h-[60px]' : 'h-[calc(100vh-2rem)] max-h-[850px]'
        )}
        style={{ width: `${width}px` }}
      >
        {/* Header */}
        <div
          className={cn(
            'flex justify-between items-center px-3 py-2',
            'border-b border-gray-200 dark:border-gray-700/50',
            'bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent',
            'shrink-0'
          )}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Notes
            </h3>
            {!isExpanded && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wordCount}w
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCopy}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label="Copy notes"
              title="Copy (Ctrl+C)"
            >
              <Copy size={14} />
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
              <Download size={14} />
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
              <Trash2 size={14} />
            </button>

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

            <button
              onClick={() => setIsPreview(!isPreview)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                isPreview
                  ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label={isPreview ? 'Switch to edit mode' : 'Switch to preview mode'}
              title={isPreview ? 'Edit mode (Ctrl+P)' : 'Preview mode (Ctrl+P)'}
            >
              {isPreview ? <Pencil size={14} /> : <Eye size={14} />}
            </button>

            <button
              onClick={() => setIsPinned(!isPinned)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                isPinned
                  ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label={isPinned ? 'Unpin editor' : 'Pin editor'}
              title={isPinned ? 'Unpin' : 'Pin (stays visible)'}
            >
              {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
            </button>

            <button
              onClick={forceSave}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label="Save notes"
              title="Save (Ctrl+S)"
            >
              <Save size={14} />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
              )}
              aria-label={isExpanded ? 'Expand editor' : 'Collapse editor'}
              title={isExpanded ? 'Expand (Ctrl+E)' : 'Collapse (Ctrl+E)'}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div
          className={cn(
            'flex-1 flex flex-col overflow-hidden transition-all duration-300 min-h-0',
            isExpanded ? 'opacity-0 h-0' : 'opacity-100'
          )}
        >
          <div className="flex-1 overflow-y-auto">
            {isPreview ? (
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
              </div>
            ) : (
              <Editor markdown={markdown} onChange={handleChange} />
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30 shrink-0">
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
                  Saved {formatTime(lastSaved)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Resize Handle */}
      {!isExpanded && (
        <div
          className={cn(
            'fixed top-4 z-50 cursor-col-resize group',
            'hover:bg-orange-400/30 dark:hover:bg-orange-500/30',
            'transition-colors duration-150'
          )}
          style={{
            right: `${width - 2}px`,
            height: 'calc(100vh - 2rem)',
            maxHeight: '850px',
            width: '4px',
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-orange-400/50 dark:bg-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

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
