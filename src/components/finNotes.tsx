'use client';

import { useEffect, useState } from 'react';
import { getStoredContent } from '@/lib/editorStorage';
import { marked } from 'marked';
import { sanitizeHtml } from '@/lib/sanitize';

export default function FinNotes({ videoId }: { videoId?: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const content = getStoredContent(videoId);
    if (!content?.trim()) return;
    const rendered = marked.parse(content) as string;
    setHtml(sanitizeHtml(rendered));
  }, [videoId]);

  if (!html) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 dark:border-white/5 pt-6">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        Your notes
      </h2>
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
