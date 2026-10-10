'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchVideoTitle } from './youtube';

const TITLES_KEY = 'video-titles';
const CONCURRENCY = 4;

/** Titles resolved through the keyless YouTube oEmbed endpoint, cached forever. */
export function getCachedTitles(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(TITLES_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function setCachedTitle(videoId: string, title: string): void {
  if (typeof window === 'undefined' || !videoId || !title) return;
  try {
    const cache = getCachedTitles();
    if (cache[videoId] === title) return;
    cache[videoId] = title;
    localStorage.setItem(TITLES_KEY, JSON.stringify(cache));
  } catch {}
}

/**
 * Resolves titles for the given video ids, reusing the on-disk cache and
 * fetching the missing ones a few at a time. Returns a map of id -> title.
 */
export function useVideoTitles(videoIds: string[]): Record<string, string> {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const attempted = useRef<Set<string>>(new Set());
  const key = videoIds.join(',');

  useEffect(() => {
    const cache = getCachedTitles();

    setTitles((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of videoIds) {
        if (!next[id] && cache[id]) {
          next[id] = cache[id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });

    const pending = videoIds.filter((id) => id && !cache[id] && !attempted.current.has(id));
    if (pending.length === 0) return;

    let cancelled = false;
    let cursor = 0;

    const worker = async () => {
      while (!cancelled) {
        const id = pending[cursor++];
        if (!id) return;
        attempted.current.add(id);
        const title = await fetchVideoTitle(id);
        if (cancelled || !title) continue;
        setCachedTitle(id, title);
        setTitles((prev) => (prev[id] === title ? prev : { ...prev, [id]: title }));
      }
    };

    void Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker)
    );

    return () => {
      cancelled = true;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return titles;
}
