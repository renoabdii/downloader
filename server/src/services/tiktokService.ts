import { VideoData, DownloadOption } from '../types/index.js';

interface TikTokScraperMedia {
  id?: string;
  caption?: string;
  thumbnail?: string;
  type?: string;
  url?: string;
  mimetype?: string;
  has_audio?: boolean;
  video_duration?: number;
  audio_url?: string;
  wm_url?: string;
}

interface TikTokScraperResult {
  id?: string;
  username?: string;
  name?: string;
  profilePicture?: string;
  media?: TikTokScraperMedia[];
  music_info?: {
    title?: string;
    author?: string;
    audio_url?: string;
  };
}

function fmtCount(n?: number): string {
  if (!n) return 'N/A';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return n.toString();
}

function fmtDur(s?: number): string {
  if (!s) return '0:00';
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

async function tryScraper(url: string): Promise<VideoData | null> {
  try {
    const mod = await import('tiktok-video-scraper');
    const Tiktok = mod.default as (url: string, opts?: { parse?: boolean }) => Promise<TikTokScraperResult>;
    const result = await Tiktok(url, { parse: true });

    if (!result || !result.media || result.media.length === 0) return null;

    const m = result.media[0];
    const options: DownloadOption[] = [];

    if (m.url) options.push({ quality: 'no-watermark', label: 'Without Watermark', url: m.url, size: 'N/A' });
    if (m.wm_url) options.push({ quality: 'with-watermark', label: 'With Watermark', url: m.wm_url, size: 'N/A' });
    const audioUrl = m.audio_url || result.music_info?.audio_url;
    if (audioUrl) options.push({ quality: 'mp3', label: 'MP3 Audio', url: audioUrl, size: 'N/A' });

    if (options.length === 0) return null;

    return {
      id: result.id || m.id || 'unknown',
      title: m.caption || 'TikTok Video',
      author: `@${result.username || result.name || 'unknown'}`,
      authorAvatar: result.profilePicture || `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(result.username || 'tiktok')}`,
      thumbnail: m.thumbnail || `https://picsum.photos/seed/${result.id}/640/360`,
      duration: fmtDur(m.video_duration ? Math.round(m.video_duration) : undefined),
      views: 'N/A',
      likes: 'N/A',
      downloadOptions: options,
    };
  } catch (err) {
    console.error('TikTok scraper failed:', err);
    return null;
  }
}

const TIKTOK_DOMAINS = ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com', 'douyin.com'];

function isValidTikTokUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return TIKTOK_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

export async function extractVideoInfo(url: string): Promise<VideoData> {
  if (!isValidTikTokUrl(url)) {
    throw new Error('Invalid TikTok URL. Please enter a valid TikTok video URL.');
  }

  const real = await tryScraper(url);
  if (real) return real;

  throw new Error('Failed to extract video. TikTok is temporarily unavailable or the video does not exist.');
}

export async function getDownloadUrl(videoUrl: string, quality: string): Promise<string> {
  const real = await tryScraper(videoUrl);
  if (!real) {
    throw new Error('Failed to fetch video. Please try again later.');
  }

  const opt = real.downloadOptions.find(o => o.quality === quality);
  if (opt?.url) return opt.url;

  if (real.downloadOptions[0]?.url) return real.downloadOptions[0].url;

  throw new Error('No download URL available for this video.');
}
