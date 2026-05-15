'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  Check,
  Download,
  FileText,
  Eye,
  Pencil,
  Save,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { getStoredContent, saveContent, clearStoredContent, getPanelState, savePanelState } from '@/lib/editorStorage';
import { useVideoContext, formatTimestamp } from '@/lib/videoContext';
import { useIsMobile } from '@/lib/useIsMobile';
import { marked } from 'marked';
import { MDXEditorMethods } from '@mdxeditor/editor';

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

const STARTING_TEMPLATE = `## Notes

`;


type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

interface EditorSectionProps {
  videoId?: string;
}

export default function EditorSection({ videoId }: EditorSectionProps) {
  const initialPanelState = useMemo(() => getPanelState(), []);
  const isMobile = useIsMobile();

  const [markdown, setMarkdown] = useState(() => getStoredContent(videoId) || STARTING_TEMPLATE);
  const [isExpanded, setIsExpanded] = useState(initialPanelState.isExpanded);
  const [width, setWidth] = useState(initialPanelState.width);
  const [isPreview, setIsPreview] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const { getCurrentTime } = useVideoContext();

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
      saveContent(content, videoId);
      setLastSaved(new Date());
      setIsSaving(false);
    }, DEBOUNCE_DELAY);
  }, [videoId]);

  const handleChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
    debouncedSave(newMarkdown);
  }, [debouncedSave]);

  const forceSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    saveContent(markdown, videoId);
    setLastSaved(new Date());
    setIsSaving(false);
    showToast('Notes saved!', 'success');
  }, [markdown, videoId, showToast]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    savePanelState({ isExpanded, width, isPinned: false });
  }, [isExpanded, width]);

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
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearStoredContent(videoId);
    setMarkdown('');
    setLastSaved(null);
    setConfirmClear(false);
    showToast('Notes cleared', 'info');
  }, [confirmClear, showToast]);

  const handleInsertTimestamp = useCallback(() => {
    const seconds = getCurrentTime();
    const ts = formatTimestamp(seconds);
    editorRef.current?.insertMarkdown(`**[${ts}]** `);
    editorRef.current?.focus();
  }, [getCurrentTime]);

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
          'relative transition-all duration-200',
          'bg-white dark:bg-gray-900',
          'flex flex-col shrink-0',
          isMobile
            ? 'w-full border-t border-orange-300/50 dark:border-orange-500/30'
            : cn(
                'h-full border-l border-orange-300/50 dark:border-orange-500/30',
                isExpanded ? 'w-[44px]' : ''
              )
        )}
        style={!isMobile && !isExpanded ? { width: `${width}px` } : undefined}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center px-2 py-2 gap-1',
            'border-b border-gray-200 dark:border-gray-700/50',
            'bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 dark:to-transparent',
            'shrink-0',
            isExpanded ? 'flex-col justify-center' : 'justify-between'
          )}
        >
          {/* Collapse toggle — always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
            )}
            aria-label={isExpanded ? 'Expand notes' : 'Collapse notes'}
            title={isExpanded ? 'Expand (Ctrl+E)' : 'Collapse (Ctrl+E)'}
          >
            {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {!isExpanded && (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  Notes
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {wordCount}w
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleInsertTimestamp}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs font-medium',
                    'bg-orange-50 dark:bg-orange-950/30',
                    'text-orange-600 dark:text-orange-400',
                    'hover:bg-orange-100 dark:hover:bg-orange-900/40',
                    'border border-orange-200 dark:border-orange-800'
                  )}
                  aria-label="Insert current video timestamp"
                  title="Insert timestamp at cursor"
                >
                  <Timer size={12} />
                  <span>Timestamp</span>
                </button>

                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-0.5" />

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
                  title={isPreview ? 'Edit (Ctrl+P)' : 'Preview (Ctrl+P)'}
                >
                  {isPreview ? <Pencil size={14} /> : <Eye size={14} />}
                </button>

                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-0.5" />

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
                  onClick={handleCopy}
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  )}
                  aria-label="Copy notes"
                  title="Copy"
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
                    confirmClear
                      ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                      : 'hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                  )}
                  aria-label={confirmClear ? 'Click again to confirm clear' : 'Clear all notes'}
                  title={confirmClear ? 'Click again to confirm' : 'Clear notes'}
                >
                  {confirmClear ? <AlertTriangle size={14} /> : <Trash2 size={14} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Resize handle — desktop sidebar only */}
        {!isMobile && !isExpanded && (
          <div
            className={cn(
              'absolute top-0 left-0 h-full w-1 cursor-col-resize group z-10',
              'hover:bg-orange-400/40 dark:hover:bg-orange-500/40',
              'transition-colors duration-150'
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-orange-400/50 dark:bg-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Editor Content */}
        <div
          className={cn(
            'flex-1 flex flex-col overflow-hidden transition-all duration-200 min-h-0',
            isExpanded ? 'hidden' : 'opacity-100'
          )}
        >
          <div className="flex-1 overflow-y-auto">
            {isPreview ? (
              <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
              </div>
            ) : (
              <Editor markdown={markdown} onChange={handleChange} editorRef={editorRef} />
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
