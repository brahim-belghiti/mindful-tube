'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ListVideo, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlaylistEntry {
  videoId: string;
  title?: string;
}

type TProps = {
  open: boolean;
  entries: PlaylistEntry[];
  index: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  label?: string;
  titles?: Record<string, string>;
};

export default function PlaylistPanel({
  open,
  entries,
  index,
  onSelect,
  onClose,
  label,
  titles,
}: TProps) {
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) currentRef.current?.scrollIntoView?.({ block: 'nearest' });
  }, [open, index]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close playlist"
        onClick={onClose}
        className="absolute inset-0 z-20 bg-black/40 lg:hidden"
      />

      <aside
        aria-label={label ? `Playlist: ${label}` : 'Playlist'}
        className={cn(
          'absolute z-30 flex flex-col overflow-hidden',
          'bg-white/95 dark:bg-[#14151c]/95 backdrop-blur-md shadow-xl',
          'inset-x-0 bottom-0 max-h-[70%] rounded-t-2xl',
          'lg:inset-y-0 lg:left-auto lg:right-0 lg:w-80 lg:max-h-none lg:rounded-none lg:rounded-l-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ListVideo size={15} className="text-orange-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
              {label ?? 'Playlist'}
            </span>
            <span className="text-[10px] tabular-nums text-gray-400 dark:text-gray-500 shrink-0">
              {entries.length} videos
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close playlist"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-0.5">
          {entries.map((entry, i) => {
            const current = i === index;
            const title = entry.title ?? titles?.[entry.videoId] ?? entry.videoId;
            return (
              <button
                key={`${entry.videoId}-${i}`}
                ref={current ? currentRef : undefined}
                type="button"
                onClick={() => {
                  onSelect(i);
                  onClose();
                }}
                aria-current={current ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2.5 w-full text-left p-1.5 rounded-xl transition-colors',
                  current
                    ? 'bg-orange-50 dark:bg-orange-500/10 ring-1 ring-orange-400/60'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5'
                )}
              >
                <span
                  className={cn(
                    'w-4 shrink-0 text-[11px] tabular-nums text-right',
                    current ? 'text-orange-500 font-semibold' : 'text-gray-400 dark:text-gray-600'
                  )}
                >
                  {current ? <ListVideo size={11} className="inline" /> : i + 1}
                </span>
                <Image
                  src={`https://img.youtube.com/vi/${entry.videoId}/mqdefault.jpg`}
                  alt=""
                  width={64}
                  height={36}
                  className="w-16 h-9 object-cover rounded-md shrink-0"
                  unoptimized
                />
                <span
                  className={cn(
                    'text-xs leading-snug line-clamp-2',
                    current
                      ? 'text-gray-900 dark:text-gray-50 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {title}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
