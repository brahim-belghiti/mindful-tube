import { Suspense } from 'react';

import VideoPlayer from '@/components/videoPlayer';
import VideoPlayerSkeleton from '@/components/videoPlayerSkeleton';

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: {
  params: Params;
  searchParams: SearchParams;
}) {}

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const videoId = searchParams?.id;

  return (
    <main>
      <section className="flex items-center justify-center h-screen">
        <Suspense fallback={<VideoPlayerSkeleton />}>
          <VideoPlayer videoId={videoId} />
        </Suspense>
      </section>
    </main>
  );
}
