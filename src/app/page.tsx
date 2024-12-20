import Image from 'next/image';
import VideoUrlInput from '@/componenets/videoUrlInput';

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col justify-center items-cente p-6 lg:p-8 gap-12 lg:gap-24">
      <div className="w-full">
        <h3 className="text-3xl xl:text-5xl text-left font-light">Escape</h3>
        <h3 className="text-3xl xl:text-5xl text-lef font-light">
          the rabbit hole.{' '}
        </h3>
        <h3 className="text-3xl xl:text-6xl text-lef font-black">be focused</h3>
      </div>
      <div className="w-full flex flex-col justify-around gap-8">
        <Image
          src="/assets/capture.png"
          alt="instruction to where to put the youtube link to watch it on the app"
          className="lg:w-8/12"
          width={380}
          height={10}
        />
        <VideoUrlInput />
   
      </div>
      <div className="flex flex-col gap-2 lg:gap-6">
        <h1 className="text-lg lg:text-3xl font-semibold">
          Distraction-Free Learning with YouTube
        </h1>
        <p className="text-base lg:text-lg">
          YouTube is an incredible platform for learning, but it's not without
          its distractions. From the suggestion bar to comment threads, staying
          focused can be a real challenge. Not to mention, visiting YouTube for
          one video often spirals into hours of unrelated content. We get it.
          That's why we built Mindfull tube — a YouTube client designed to keep
          you on track.
        </p>
      </div>
    </main>
  );
}
