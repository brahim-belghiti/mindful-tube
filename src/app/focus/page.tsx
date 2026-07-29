'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';
import FocusLayout from '@/components/focusLayout';
import AddToList from '@/components/addToList';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVideoContext } from '@/lib/videoContext';
import { useCollection } from '@/lib/useCollections';
import { collectionWatchHref, resolveIndex } from '@/lib/collectionPlayback';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/editorSection'));

function FocusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get('id') ?? undefined;
  const playlistId = searchParams.get('list') ?? undefined;
  const collectionId = searchParams.get('c') ?? undefined;
  const [title, setTitle] = useState<string | undefined>();
  const { playlist, prevVideo, nextVideo } = useVideoContext();
  const { collection } = useCollection(collectionId);

  // A user-made list is driven by navigation; a YouTube playlist by the iframe player.
  let nav: {
    label?: string;
    index: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
  } | null = null;
  let onVideoEnd: (() => void) | undefined;

  if (collection && collection.items.length > 0) {
    const index = resolveIndex(collection, videoId, searchParams.get('i'));
    const go = (to: number) => {
      const href = collectionWatchHref(collection, to);
      if (href) router.push(href);
    };
    const goNext = () => go(index + 1);
    nav = {
      label: collection.name,
      index,
      total: collection.items.length,
      onPrev: () => go(index - 1),
      onNext: goNext,
    };
    onVideoEnd =
      index < collection.items.length - 1
        ? goNext
        : () => router.push(`/fin${videoId ? `?id=${videoId}` : ''}`);
  } else if (playlist) {
    nav = {
      index: playlist.index,
      total: playlist.total,
      onPrev: prevVideo,
      onNext: nextVideo,
    };
  }

  return (
    <main className="flex flex-col lg:flex-row w-full h-screen p-3 gap-3 bg-[#eaecf4] dark:bg-[#0c0d12] overflow-hidden">
      <section className="relative flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden min-w-0 shadow-md">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer
            videoId={videoId}
            playlistId={playlistId}
            onTitleLoad={setTitle}
            onVideoEnd={onVideoEnd}
          />
        </Suspense>

        {videoId && (
          <div className="absolute top-4 right-4 z-10 opacity-40 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <AddToList videoId={videoId} title={title} />
          </div>
        )}

        {nav && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <button
              onClick={nav.onPrev}
              disabled={nav.index === 0}
              aria-label="Previous video"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium disabled:opacity-30 hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium tabular-nums">
              {nav.label && (
                <span className="mr-2 font-normal opacity-70">{nav.label}</span>
              )}
              {nav.index + 1} / {nav.total}
            </span>

            <button
              onClick={nav.onNext}
              disabled={nav.index === nav.total - 1}
              aria-label="Next video"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium disabled:opacity-30 hover:bg-black/80 transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      <Suspense fallback={
        <div className="w-80 rounded-2xl bg-white dark:bg-[#14151c] shadow-md shrink-0" />
      }>
        <Editor videoId={videoId} title={title} />
      </Suspense>
    </main>
  );
}

export default function Page() {
  return (
    <FocusLayout>
      <Suspense fallback={
        <div className="w-full h-screen bg-[#eaecf4] dark:bg-[#0c0d12]" />
      }>
        <FocusContent />
      </Suspense>
    </FocusLayout>
  );
}
