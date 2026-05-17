import { Suspense } from 'react';
import dynamic from 'next/dynamic';
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
      <main className="flex flex-col lg:flex-row w-full h-screen p-3 gap-3 bg-[#eaecf4] dark:bg-[#0c0d12] overflow-hidden">
        {/* Video card */}
        <section className="flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden min-w-0 shadow-md">
          <Suspense fallback={<VideoPlayerSkeleton />}>
            <VideoPlayer videoId={videoId} playlistId={playlistId} />
          </Suspense>
        </section>

        {/* Notes card */}
        <Suspense fallback={
          <div className="w-80 rounded-2xl bg-white dark:bg-[#14151c] shadow-md shrink-0" />
        }>
          <Editor videoId={typeof videoId === 'string' ? videoId : videoId?.[0]} />
        </Suspense>
      </main>
    </FocusLayout>
  );
}
