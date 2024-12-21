'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

type TProps = { videoId: string | string[] | undefined };

export default function VideoPlayer({ videoId }: TProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();
  const videoOptions: YouTubeProps['opts'] = {
    height: '640',
    width: '1032',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleVideoEnd = () => {
    setIsCompleted(true);
  };

  useEffect(() => {
    if (isCompleted) {
      router.push('/fin');
    }
  }, [isCompleted, router]);

  // Ensure videoId is a string
  const validVideoId = Array.isArray(videoId) ? videoId[0] : videoId;

  return (
    <YouTube
      videoId={validVideoId}
      opts={videoOptions}
      className="w-screen h-fit lg:h-full lg:w-full flex justify-center items-center"
      onEnd={handleVideoEnd}
    />
  );
}
