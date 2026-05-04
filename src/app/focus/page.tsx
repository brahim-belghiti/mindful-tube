import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';

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
    <main className="h-full w-full relative">
      <section className="w-full h-full flex items-center justify-center">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer videoId={videoId} />
        </Suspense>
      </section>

      <Suspense fallback={<div>Loading Editor...</div>}>
        <Editor />
      </Suspense>
    </main>
  );
}
