import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';

// Dynamically import components with SSR disabled
const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/MdxEditor'));

// Define types for route parameters and search parameters
type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  // Add metadata logic here if needed
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const videoId = searchParams?.id;

  return (
    <main className="flex flex-col lg:flex-row w-full h-screen items-center justify-center gap-4">
      <section className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer
            videoId={Array.isArray(videoId) ? videoId[0] : videoId}
          />
        </Suspense>
      </section>

      <section className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 min-h-[640px] max-h-[640px] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Start taking notes</h3>
        </div>
        <Suspense fallback={'...'}>
          <Editor />
        </Suspense>
      </section>
    </main>
  );
}
