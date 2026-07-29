'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, GripVertical, Play, Trash2, X } from 'lucide-react';
import ThemeToggle from '@/components/themeToggle';
import {
  addToCollection,
  deleteCollection,
  moveItem,
  removeFromCollection,
  renameCollection,
  setItemTitle,
} from '@/lib/collections';
import { useCollection } from '@/lib/useCollections';
import { collectionWatchHref } from '@/lib/collectionPlayback';
import { fetchVideoTitle } from '@/lib/youtube';
import { validYoutbeUrlLink } from '@/lib/utils';
import { cn } from '@/lib/utils';

const BARE_ID = /^[\w-]{11}$/;

function parseVideoInput(value: string): string {
  const trimmed = value.trim();
  const fromUrl = validYoutbeUrlLink(trimmed);
  if (fromUrl) return fromUrl;
  return BARE_ID.test(trimmed) ? trimmed : '';
}

export default function ListPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { collection, loaded } = useCollection(id);

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const backfilled = useRef(new Set<string>());

  useEffect(() => {
    if (collection) setName(collection.name);
  }, [collection?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Videos added by URL have no title until we ask YouTube for one.
  useEffect(() => {
    if (!collection || !id) return;
    for (const item of collection.items) {
      if (item.title || backfilled.current.has(item.videoId)) continue;
      backfilled.current.add(item.videoId);
      fetchVideoTitle(item.videoId).then((title) => {
        if (title) setItemTitle(id, item.videoId, title);
      });
    }
  }, [collection, id]);

  if (!loaded) return null;

  if (!collection || !id) {
    return (
      <main className="w-full h-full flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">This list no longer exists.</p>
        <Link
          href="/"
          className="text-sm text-orange-500 hover:text-orange-600 underline underline-offset-2"
        >
          Back home
        </Link>
      </main>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = parseVideoInput(url);
    if (!videoId) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }
    if (collection.items.some((i) => i.videoId === videoId)) {
      setError('That video is already in this list.');
      return;
    }
    addToCollection(id, videoId);
    setUrl('');
    setError('');
  };

  const handleDeleteList = () => {
    if (!confirm(`Delete "${collection.name}"? Your notes are kept.`)) return;
    deleteCollection(id);
    router.push('/');
  };

  const handleDrop = (to: number) => {
    if (dragIndex !== null) moveItem(id, dragIndex, to);
    setDragIndex(null);
    setOverIndex(null);
  };

  const playHref = collectionWatchHref(collection, 0);

  return (
    <main className="w-full h-full overflow-y-auto flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-[#14151c] rounded-2xl shadow-md p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={13} />
              Home
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1 min-w-0">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (name.trim()) renameCollection(id, name);
                  else setName(collection.name);
                }}
                maxLength={60}
                aria-label="List name"
                className="text-3xl font-black leading-tight text-gray-900 dark:text-gray-50 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
              />
              <p className="text-sm text-gray-400 dark:text-gray-500 font-light">
                {collection.items.length}{' '}
                {collection.items.length === 1 ? 'video' : 'videos'} · drag to reorder
              </p>
            </div>

            <div className="flex items-center gap-2">
              {playHref && (
                <Link
                  href={playHref}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                >
                  <Play size={14} />
                  Play list
                </Link>
              )}
              <button
                onClick={handleDeleteList}
                aria-label="Delete list"
                className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Add a video */}
        <form onSubmit={handleAdd} className="flex flex-col gap-2" noValidate>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste a YouTube video link to add it…"
              aria-label="YouTube video link"
              aria-invalid={!!error}
              className={cn(
                'flex-1 min-w-0 px-4 py-2.5 rounded-xl border-2 text-sm bg-white dark:bg-gray-900',
                'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-white/10 focus:border-orange-400 focus:ring-orange-400'
              )}
            />
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Add
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </form>

        {/* Items */}
        {collection.items.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 py-6 text-center">
            Nothing here yet. Paste a link above, or add videos from your watch history.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {collection.items.map((item, index) => (
              <li
                key={item.videoId}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(index);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                onDrop={() => handleDrop(index)}
                className={cn(
                  'group flex items-center gap-3 p-2 rounded-xl transition-colors',
                  'hover:bg-gray-50 dark:hover:bg-white/5',
                  dragIndex === index && 'opacity-40',
                  overIndex === index && dragIndex !== index && 'ring-2 ring-orange-400'
                )}
              >
                <GripVertical
                  size={15}
                  className="shrink-0 text-gray-300 dark:text-gray-700 cursor-grab active:cursor-grabbing"
                  aria-hidden
                />
                <span className="w-5 shrink-0 text-xs text-gray-400 dark:text-gray-600 tabular-nums">
                  {index + 1}
                </span>

                <Link
                  href={collectionWatchHref(collection, index) ?? '#'}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt=""
                    width={96}
                    height={54}
                    className="w-24 h-[54px] object-cover rounded-lg shrink-0"
                    unoptimized
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                    {item.title ?? item.videoId}
                  </span>
                </Link>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => moveItem(id, index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(id, index, index + 1)}
                    disabled={index === collection.items.length - 1}
                    aria-label="Move down"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => removeFromCollection(id, item.videoId)}
                    aria-label={`Remove ${item.title ?? 'video'} from list`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
