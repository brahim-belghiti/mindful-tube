'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';
import FocusLayout from '@/components/focusLayout';
import { useSearchParams } from 'next/navigation';
import { useVideoContext } from '@/lib/videoContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/editorSection'));

function FocusContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id') ?? undefined;
  const playlistId = searchParams.get('list') ?? undefined;
  const [title, setTitle] = useState<string | undefined>();
  const { playlist, prevVideo, nextVideo } = useVideoContext();

  return (
    <main className="flex flex-col lg:flex-row w-full h-screen p-3 gap-3 bg-[#eaecf4] dark:bg-[#0c0d12] overflow-hidden">
      <section className="relative flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden min-w-0 shadow-md">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer videoId={videoId} playlistId={playlistId} onTitleLoad={setTitle} />
        </Suspense>

        {playlist && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <button
              onClick={prevVideo}
              disabled={playlist.index === 0}
              aria-label="Previous video"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium disabled:opacity-30 hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium tabular-nums">
              {playlist.index + 1} / {playlist.total}
            </span>

            <button
              onClick={nextVideo}
              disabled={playlist.index === playlist.total - 1}
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
