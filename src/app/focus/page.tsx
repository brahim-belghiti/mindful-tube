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

  return (
    <FocusLayout>
      <main className="flex flex-col h-screen w-full overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Link
            href="/"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            Mindful Tube
          </Link>
        </header>

        {/* Content: video + notes side by side */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video area */}
          <section className="flex-1 flex items-center justify-center p-4 min-w-0">
            <Suspense fallback={<VideoPlayerSkeleton />}>
              <VideoPlayer videoId={videoId} />
            </Suspense>
          </section>

          {/* Notes panel */}
          <Suspense fallback={<div className="w-80 border-l border-gray-200 dark:border-gray-800" />}>
            <Editor />
          </Suspense>
        </div>
      </main>
    </FocusLayout>
  );
}
