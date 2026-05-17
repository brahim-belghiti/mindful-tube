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
    <div className="w-full max-w-2xl flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 pt-10">
      <h2 className="text-lg font-semibold">Your notes</h2>
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
