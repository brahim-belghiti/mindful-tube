'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import { useVideoContext } from '@/lib/videoContext';
import { recordWatch } from '@/lib/watchHistory';
import { fetchVideoTitle } from '@/lib/youtube';

type TProps = {
  videoId: string | string[] | undefined;
  playlistId?: string | string[] | undefined;
  onTitleLoad?: (title: string) => void;
};

export default function VideoPlayer({ videoId, playlistId, onTitleLoad }: TProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);
  const router = useRouter();
  const { registerGetTime, registerSeekTo, setPlaylist, registerNextVideo, registerPrevVideo } = useVideoContext();

  const validVideoId = Array.isArray(videoId) ? videoId[0] : videoId;
  const validPlaylistId = Array.isArray(playlistId) ? playlistId[0] : playlistId;

  useEffect(() => {
    registerGetTime(() => playerRef.current?.getCurrentTime() ?? 0);
    registerSeekTo((seconds: number) => {
      playerRef.current?.seekTo(seconds, true);
    });
    registerNextVideo(() => {
      playerRef.current?.nextVideo();
    });
    registerPrevVideo(() => {
      playerRef.current?.previousVideo();
    });
  }, [registerGetTime, registerSeekTo, registerNextVideo, registerPrevVideo]);

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

  const updatePlaylistState = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      const list = player.getPlaylist();
      if (Array.isArray(list) && list.length > 1) {
        setPlaylist({ index: player.getPlaylistIndex(), total: list.length });
      } else {
        setPlaylist(null);
      }
    } catch {
      setPlaylist(null);
    }
  };

  const handleReady = async (e: YouTubeEvent) => {
    playerRef.current = e.target;
    updatePlaylistState();
    if (!validVideoId) return;
    const title = await fetchVideoTitle(validVideoId);
    recordWatch(validVideoId, title ?? undefined);
    if (title) onTitleLoad?.(title);
  };

  const handleStateChange = () => {
    updatePlaylistState();
  };

  return (
    <div className="w-full aspect-video max-h-full">
      <YouTube
        videoId={validVideoId ?? ''}
        opts={videoOptions}
        iframeClassName="w-full h-full"
        className="w-full h-full"
        onReady={handleReady}
        onStateChange={handleStateChange}
        onEnd={() => { if (!validPlaylistId) setIsCompleted(true); }}
      />
    </div>
  );
}
