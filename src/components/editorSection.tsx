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
  Home,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/lib/themeContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getStoredContent, saveContent, clearStoredContent, getPanelState, savePanelState } from '@/lib/editorStorage';
import { useVideoContext, formatTimestamp } from '@/lib/videoContext';
import { useIsMobile } from '@/lib/useIsMobile';
import { marked } from 'marked';
import { MDXEditorMethods } from '@mdxeditor/editor';

const Editor = dynamic(() => import('./mdxEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg" />
  ),
});

const DEBOUNCE_DELAY = 500;
const TOAST_DURATION = 3000;
const MIN_WIDTH = 280;
const MAX_WIDTH = 820;

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
  const { theme, toggle: toggleTheme } = useTheme();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  const debouncedSave = useCallback((content: string) => {
    setIsSaving(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
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
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    saveContent(markdown, videoId);
    setLastSaved(new Date());
    setIsSaving(false);
    showToast('Notes saved!', 'success');
  }, [markdown, videoId, showToast]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    savePanelState({ isExpanded, width, isPinned: false });
  }, [isExpanded, width]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key === 's') { e.preventDefault(); forceSave(); }
      if (modifier && e.key === 'e') { e.preventDefault(); setIsExpanded((p) => !p); }
      if (modifier && e.key === 'p') { e.preventDefault(); setIsPreview((p) => !p); }
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
  }, [confirmClear, videoId, showToast]);

  const handleInsertTimestamp = useCallback(() => {
    const seconds = getCurrentTime();
    const ts = formatTimestamp(seconds);
    editorRef.current?.insertMarkdown(`**[${ts}]** `);
    editorRef.current?.focus();
  }, [getCurrentTime]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) { showToast('Nothing to copy', 'info'); return; }
    try {
      await navigator.clipboard.writeText(markdown);
      showToast('Copied!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  }, [markdown, showToast]);

  const handleExport = useCallback(() => {
    if (!markdown.trim()) { showToast('Nothing to export', 'info'); return; }
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported!', 'success');
  }, [markdown, showToast]);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderedMarkdown = useMemo(() => marked.parse(markdown), [markdown]);

  return (
    <>
      <section
        className={cn(
          'relative flex flex-col shrink-0',
          'bg-white dark:bg-[#14151c]',
          'shadow-md',
          isMobile
            ? 'w-full rounded-2xl'
            : cn(
                'h-full rounded-2xl overflow-hidden',
                isExpanded ? 'w-[44px]' : ''
              )
        )}
        style={!isMobile && !isExpanded ? { width: `${width}px` } : undefined}
      >
        {/* Resize handle */}
        {!isMobile && !isExpanded && (
          <div
            className="absolute top-8 bottom-8 left-0 w-1.5 cursor-col-resize z-10 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-150"
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Header */}
        <div
          className={cn(
            'flex items-center px-3 py-2.5 shrink-0 border-b border-gray-100/80 dark:border-white/5',
            isExpanded ? 'flex-col justify-center gap-2' : 'justify-between'
          )}
        >
          {/* Notes chip label */}
          {!isExpanded && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 select-none">
                <FileText size={11} className="text-gray-500 dark:text-gray-400" />
                Notes
                {wordCount > 0 && (
                  <span className="ml-0.5 text-gray-400 dark:text-gray-500">{wordCount}w</span>
                )}
              </div>
              {(isSaving || lastSaved) && (
                <span className={cn('text-[10px]', isSaving ? 'text-gray-400' : 'text-green-500 dark:text-green-400')}>
                  {isSaving ? 'saving…' : `saved ${formatTime(lastSaved!)}`}
                </span>
              )}
            </div>
          )}

          {/* Right side: home + theme toggle + collapse */}
          <div className={cn('flex items-center gap-1', isExpanded && 'flex-col')}>
            {!isExpanded && (
              <Link
                href="/"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
                title="Home"
                aria-label="Go home"
              >
                <Home size={13} />
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
              aria-label={isExpanded ? 'Expand notes' : 'Collapse notes'}
              title={isExpanded ? 'Expand (Ctrl+E)' : 'Collapse (Ctrl+E)'}
            >
              {isExpanded ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>
        </div>

        {/* Editor content */}
        <div
          className={cn(
            'flex-1 flex flex-col overflow-hidden min-h-0 transition-all duration-200',
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

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-2.5 py-2 border-t border-gray-100/80 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.02] shrink-0 gap-1.5">
            {/* Left: timestamp + char count */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleInsertTimestamp}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
                title="Insert timestamp"
              >
                <Timer size={10} />
                Timestamp
              </button>
              <span className="text-[10px] text-gray-400 dark:text-gray-600 pl-1">{charCount}c</span>
            </div>

            {/* Right: action icon buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={cn(
                  'p-1.5 rounded-lg transition-all text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
                  isPreview && 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
                )}
                title={isPreview ? 'Edit (Ctrl+P)' : 'Preview (Ctrl+P)'}
                aria-label={isPreview ? 'Edit mode' : 'Preview mode'}
              >
                {isPreview ? <Pencil size={13} /> : <Eye size={13} />}
              </button>

              <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

              <button
                onClick={forceSave}
                className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Save (Ctrl+S)"
                aria-label="Save notes"
              >
                <Save size={13} />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Copy"
                aria-label="Copy notes"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Export as .md"
                aria-label="Export notes"
              >
                <Download size={13} />
              </button>

              <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 mx-0.5" />

              <button
                onClick={handleClearNotes}
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  confirmClear
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400'
                    : 'text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                )}
                title={confirmClear ? 'Click again to confirm' : 'Clear notes'}
                aria-label={confirmClear ? 'Confirm clear' : 'Clear notes'}
              >
                {confirmClear ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-5 right-5 z-[100]',
            'px-3.5 py-2.5 rounded-xl shadow-lg',
            'flex items-center gap-2',
            'animate-in slide-in-from-bottom-2 fade-in duration-200',
            toast.type === 'success' && 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
            toast.type === 'error' && 'bg-red-500 text-white',
            toast.type === 'info' && 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800'
          )}
        >
          {toast.type === 'success' && <Check size={13} />}
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
}
