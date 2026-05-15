'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { useVideoContext } from '@/lib/videoContext';
import { recordWatch } from '@/lib/watchHistory';

type TProps = {
  videoId: string | string[] | undefined;
  playlistId?: string | string[] | undefined;
};

export default function VideoPlayer({ videoId, playlistId }: TProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);
  const router = useRouter();
  const { registerGetTime } = useVideoContext();

  const validVideoId = Array.isArray(videoId) ? videoId[0] : videoId;
  const validPlaylistId = Array.isArray(playlistId) ? playlistId[0] : playlistId;

  useEffect(() => {
    registerGetTime(() => playerRef.current?.getCurrentTime() ?? 0);
  }, [registerGetTime]);

  const videoOptions: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      ...(validPlaylistId ? { list: validPlaylistId, listType: 'playlist' } : {}),
    },
  };

  useEffect(() => {
    if (isCompleted) {
      const params = new URLSearchParams();
      if (validVideoId) params.set('id', validVideoId);
      router.push(`/fin?${params.toString()}`);
    }
  }, [isCompleted, router, validVideoId]);

  return (
    <div className="w-full aspect-video max-h-[calc(100vh-4rem)]">
      <YouTube
        videoId={validVideoId ?? ''}
        opts={videoOptions}
        iframeClassName="w-full h-full rounded-lg"
        className="w-full h-full"
        onReady={(e) => {
          playerRef.current = e.target;
          if (validVideoId) recordWatch(validVideoId);
        }}
        onEnd={() => { if (!validPlaylistId) setIsCompleted(true); }}
      />
    </div>
  );
}
