'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';
import FocusLayout from '@/components/focusLayout';
import { useSearchParams } from 'next/navigation';

const VideoPlayer = dynamic(() => import('../../components/videoPlayer'));
const Editor = dynamic(() => import('../../components/editorSection'));

function FocusContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id') ?? undefined;
  const playlistId = searchParams.get('list') ?? undefined;
  const [title, setTitle] = useState<string | undefined>();

  return (
    <main className="flex flex-col lg:flex-row w-full h-screen p-3 gap-3 bg-[#eaecf4] dark:bg-[#0c0d12] overflow-hidden">
      <section className="flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden min-w-0 shadow-md">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer videoId={videoId} playlistId={playlistId} onTitleLoad={setTitle} />
        </Suspense>
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
