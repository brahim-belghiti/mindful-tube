'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { useVideoContext } from '@/lib/videoContext';

type TProps = { videoId: string | string[] | undefined };

export default function VideoPlayer({ videoId }: TProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);
  const router = useRouter();
  const { registerGetTime } = useVideoContext();

  useEffect(() => {
    registerGetTime(() => playerRef.current?.getCurrentTime() ?? 0);
  }, [registerGetTime]);

  const videoOptions: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: { autoplay: 1 },
  };

  useEffect(() => {
    if (isCompleted) router.push('/fin');
  }, [isCompleted, router]);

  const validVideoId = Array.isArray(videoId) ? videoId[0] : videoId;

  return (
    <div className="w-full aspect-video max-h-[calc(100vh-4rem)]">
      <YouTube
        videoId={validVideoId}
        opts={videoOptions}
        iframeClassName="w-full h-full rounded-lg"
        className="w-full h-full"
        onReady={(e) => { playerRef.current = e.target; }}
        onEnd={() => setIsCompleted(true)}
      />
    </div>
  );
}
