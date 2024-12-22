import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';

const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/editorSection'));

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const videoId = searchParams?.id;

  return (
    <main className="h-full w-full relative">
      <section className="w-full h-full flex items-center justify-center">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer
            videoId={Array.isArray(videoId) ? videoId[0] : videoId}
          />
        </Suspense>
      </section>

      <section className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-orange-300 absolute top-4 right-4">
        <Editor />
      </section>
    </main>
  );
}
