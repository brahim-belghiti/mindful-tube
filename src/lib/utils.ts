import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function validYoutbeUrlLink(videoUrl: string): string {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:[&?].*)?$/i;
  const match = videoUrl.match(regex);
  return match ? match[1] : '';
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}