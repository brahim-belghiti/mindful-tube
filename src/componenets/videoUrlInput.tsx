'use client';

import { useRef } from 'react';
const VideoUrlInput = () => {
  const videoUrl = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (videoUrl.current) {
      console.log('Input value:', videoUrl.current.value);
    }
  };

  return (
    <div className='w-full flex flex-col gap-2'>
      <input
        className="mt-1 block py-2 px-3 border-4 border-orange-400 bg-white rounded-full shadow-sm focus:outline-none focus:ring-orange-600 focus:border-orange-600 w-10/12 font-light text-lg xl:text-xl h-16"
        placeholder="past your Youtube video link here: https://www.youtube.com/watch?v=D55ctBYF3AY"
        type="text"
        ref={videoUrl}
      />
      <button
        className="w-10/12 bg-orange-400 text-white py-2 px-4 rounded-full shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-orange-600 font-light text-lg xl:text-xl h-16"
        onClick={handleSubmit}
      >
        submit
      </button>
    </div>
  );
};

export default VideoUrlInput;
