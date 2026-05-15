import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';
import FocusLayout from '@/components/focusLayout';

const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/editorSection'));

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const videoId = resolvedSearchParams?.id;
  const playlistId = resolvedSearchParams?.list;

  return (
    <FocusLayout>
      <main className="flex flex-col w-full min-h-screen lg:h-screen lg:overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Link
            href="/"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            Mindful Tube
          </Link>
        </header>

        {/* Content: stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
          {/* Video area */}
          <section className="w-full lg:flex-1 flex items-center justify-center p-4 lg:min-w-0">
            <Suspense fallback={<VideoPlayerSkeleton />}>
              <VideoPlayer videoId={videoId} playlistId={playlistId} />
            </Suspense>
          </section>

          {/* Notes panel */}
          <Suspense fallback={<div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800" />}>
            <Editor videoId={typeof videoId === 'string' ? videoId : videoId?.[0]} />
          </Suspense>
        </div>
      </main>
    </FocusLayout>
  );
}
