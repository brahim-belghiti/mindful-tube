'use client';

import { useRef } from 'react';
import { validYoutbeUrlLink } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const VideoUrlInput = () => {
  const videoUrl = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleSubmit = () => {
    if (videoUrl.current && feedbackRef.current) {
      const url = videoUrl.current.value;
      const videoId = validYoutbeUrlLink(url);

      if (!videoId) {
        feedbackRef.current.textContent =
          '❌ Invalid YouTube URL. Please enter a valid link.';
        feedbackRef.current.className =
          'w-full lg:w-10/12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative rounded-full mt-5 dark:bg-red-900 dark:border-red-600 dark:text-red-200';
      } else {
        feedbackRef.current.textContent =
          '✅ Valid YouTube URL. You will be redirected shortly.';
        feedbackRef.current.className =
          'w-full lg:w-10/12 bg-green-100 border border-green-400 text-green-700 px-4 py-3 relative rounded-full mt-5 dark:bg-green-900 dark:border-green-600 dark:text-green-200';
        console.log('Valid URL. Redirect logic will go here.');
        router.push(`/focus?id=${videoId}`);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <input
        className="w-full lg:w-10/12 mt-1 block py-2 px-3 border-4 border-orange-400 bg-white rounded-full shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 font-light text-lg xl:text-xl h-14 dark:bg-gray-800 dark:border-orange-500 dark:placeholder-gray-400 dark:text-white"
        placeholder="Paste your YouTube video link here: https://www.youtube.com/watch?v=D55ctBYF3AY"
        type="text"
        ref={videoUrl}
      />
      <button
        className="w-full lg:w-10/12 bg-orange-400 text-white py-2 px-4 rounded-full shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-orange-600 font-light text-lg xl:text-xl h-14 dark:bg-orange-500 dark:hover:bg-orange-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <div
        ref={feedbackRef}
        aria-live="polite"
        className="w-full lg:w-10/12 mt-5"
      ></div>
    </div>
  );
};

export default VideoUrlInput;
