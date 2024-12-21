const VideoPlayerSkeleton = () => (
  <section className="w-full h-full flex items-center justify-center animate">
    <div className="w-full h-full lg:w-[1032px] lg:h-[640px] flex flex-col animate-pulse bg-gray-200 rounded-lg">
      <div className="flex-1 bg-gray-300">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-400 animate"></div>
        </div>
      </div>
      <div className="h-12 px-4 flex items-center gap-4 bg-gray-300">
        <div className="w-8 h-8 rounded-full bg-gray-400 animate"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="w-20 h-4 bg-gray-400 rounded"></div>
      </div>
    </div>
  </section>
);

export default VideoPlayerSkeleton;
