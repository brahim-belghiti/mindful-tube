'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getWatchHistory, clearWatchHistory, HistoryEntry } from '@/lib/watchHistory';
import AddToList from '@/components/addToList';
import { Trash2 } from 'lucide-react';

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentlyWatched() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  if (history.length === 0) return null;

  const handleClear = () => {
    clearWatchHistory();
    setHistory([]);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Recently watched
        </p>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="Clear watch history"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {history.map((entry) => (
          <Link
            key={entry.videoId}
            href={`/focus?id=${entry.videoId}`}
            className="flex-shrink-0 flex flex-col gap-1.5 group w-40"
          >
            <div className="relative rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-orange-400 dark:group-hover:ring-orange-500 transition-all">
              <Image
                src={`https://img.youtube.com/vi/${entry.videoId}/mqdefault.jpg`}
                alt={entry.title ?? 'Video thumbnail'}
                width={160}
                height={90}
                className="w-40 h-[90px] object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-between gap-1 p-1.5">
                <span className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <AddToList videoId={entry.videoId} title={entry.title} stopPropagation />
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded-md">
                  Watch again
                </span>
              </div>
            </div>
            {entry.title && (
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                {entry.title}
              </p>
            )}
            <p className="text-[10px] text-gray-400 dark:text-gray-600">
              {timeAgo(entry.watchedAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
