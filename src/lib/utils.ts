import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function validYoutbeUrlLink(videoUrl: string): string {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})(?:[&?].*)?$/i;
  const match = videoUrl.match(regex);
  return match ? match[1] : '';
}

export function extractPlaylistId(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = parsed.hostname.replace('www.', '');
    if (host !== 'youtube.com' && host !== 'youtu.be') return '';
    return parsed.searchParams.get('list') ?? '';
  } catch {
    return '';
  }
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}