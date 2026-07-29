'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ListVideo, Play, Plus } from 'lucide-react';
import { createCollection } from '@/lib/collections';
import { useCollections } from '@/lib/useCollections';
import { collectionWatchHref } from '@/lib/collectionPlayback';

export default function CollectionsSection() {
  const { collections, loaded } = useCollections();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setCreating(false);
      return;
    }
    createCollection(trimmed);
    setName('');
    setCreating(false);
  };

  // Nothing to show and nothing saved yet — stay out of the way.
  if (!loaded || (collections.length === 0 && !creating)) {
    return (
      <div className="w-full flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Your lists
        </p>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <Plus size={12} />
          New list
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Your lists
        </p>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <Plus size={12} />
          New list
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate}>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleCreate}
            placeholder="List name…"
            maxLength={60}
            aria-label="New list name"
            className="w-full px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </form>
      )}

      <div className="flex flex-col gap-1.5">
        {collections.map((collection) => {
          const watchHref = collectionWatchHref(collection, 0);
          return (
            <div
              key={collection.id}
              className="group flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <Link
                href={`/lists/${collection.id}`}
                className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2.5"
              >
                <ListVideo size={15} className="shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {collection.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums shrink-0">
                  {collection.items.length}
                </span>
                <ChevronRight
                  size={14}
                  className="ml-auto shrink-0 text-gray-300 dark:text-gray-700"
                />
              </Link>

              {watchHref && (
                <Link
                  href={watchHref}
                  aria-label={`Play ${collection.name}`}
                  className="shrink-0 mr-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-orange-400 dark:hover:bg-orange-500 transition-colors"
                >
                  <Play size={14} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
