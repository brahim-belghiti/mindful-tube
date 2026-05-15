'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getWatchHistory, clearWatchHistory, HistoryEntry } from '@/lib/watchHistory';
import { Trash2 } from 'lucide-react';

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
    <div className="w-full max-w-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recently watched</p>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label="Clear watch history"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {history.map((entry) => (
          <Link
            key={entry.videoId}
            href={`/focus?id=${entry.videoId}`}
            className="flex-shrink-0 group relative rounded-xl overflow-hidden ring-2 ring-transparent hover:ring-orange-400 dark:hover:ring-orange-500 transition-all"
          >
            <Image
              src={`https://img.youtube.com/vi/${entry.videoId}/mqdefault.jpg`}
              alt="Video thumbnail"
              width={160}
              height={90}
              className="w-40 h-[90px] object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-md">
                Watch again
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
