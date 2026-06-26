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

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function getFileSize(url: string): Promise<string> {
  try {
    const resp = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' }, signal: AbortSignal.timeout(5000) });
    const total = resp.headers.get('content-range')?.match(/\/(\d+)$/)?.[1];
    const len = total || resp.headers.get('content-length');
    if (!len) return 'N/A';
    const bytes = parseInt(len, 10);
    if (bytes <= 0) return 'N/A';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  } catch {
    return 'N/A';
  }
}

async function tryScraper(url: string): Promise<VideoData | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const mod = await import('tiktok-video-scraper');
      const Tiktok = mod.default as (url: string, opts?: { parse?: boolean }) => Promise<TikTokScraperResult>;
      const result = await Tiktok(url, { parse: true });

      if (!result || !result.media || result.media.length === 0) return null;

      const options: DownloadOption[] = [];
      const hasVideo = result.media.some(m => m.type === 'video');
      const images = result.media.filter(m => m.type === 'image');

      if (hasVideo) {
        const video = result.media.find(m => m.type === 'video') || result.media[0];
        if (video.url) options.push({ quality: 'no-watermark', label: 'Without Watermark', url: video.url, size: 'N/A' });
        if (video.wm_url) options.push({ quality: 'with-watermark', label: 'With Watermark', url: video.wm_url, size: 'N/A' });
        const audioUrl = video.audio_url || result.music_info?.audio_url;
        if (audioUrl) options.push({ quality: 'mp3', label: 'MP3 Audio', url: audioUrl, size: 'N/A' });
      }

      if (images.length === 1 && images[0].url) {
        options.push({ quality: 'photo', label: 'Download Image', url: images[0].url, size: 'N/A' });
      } else if (images.length > 1) {
        images.forEach((img, i) => {
          if (img.url) options.push({ quality: `photo-${i + 1}`, label: `Image ${i + 1}`, url: img.url, size: 'N/A' });
        });
      }

      if (options.length === 0) return null;

      const sizes = await Promise.all(options.map(o => getFileSize(o.url)));
      sizes.forEach((s, i) => { options[i].size = s; });

      const first = result.media[0];
      const dur = hasVideo
        ? fmtDur(Math.round((result.media.find(m => m.type === 'video') || result.media[0])?.video_duration || 0))
        : (images.length > 1 ? `${images.length} images` : 'Photo');

      return {
        id: result.id || first.id || 'unknown',
        title: first.caption || (images.length > 1 ? 'TikTok Photo' : 'TikTok Video'),
        author: `@${result.username || result.name || 'unknown'}`,
        authorAvatar: result.profilePicture || `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(result.username || 'tiktok')}`,
        thumbnail: first.thumbnail || `https://picsum.photos/seed/${result.id}/640/360`,
        duration: dur,
        views: 'N/A',
        likes: 'N/A',
        downloadOptions: options,
      };
    } catch (err) {
      console.error(`TikTok scraper attempt ${attempt + 1} failed:`, err);
      if (attempt === 0) await sleep(1500);
    }
  }
  return null;
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

const cache = new Map<string, { data: VideoData; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(url: string): VideoData | undefined {
  const entry = cache.get(url);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  cache.delete(url);
  return undefined;
}

function setCache(url: string, data: VideoData): void {
  cache.set(url, { data, ts: Date.now() });
  if (cache.size > 200) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
}

function sanitizeFilename(title: string): string {
  return title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80)
    .replace(/_+$/, '')
    || 'tiktok';
}

export async function extractVideoInfo(url: string): Promise<VideoData> {
  if (!isValidTikTokUrl(url)) {
    throw new Error('Invalid TikTok URL. Please enter a valid TikTok video URL.');
  }

  const cached = getCached(url);
  if (cached) return cached;

  const real = await tryScraper(url);
  if (real) {
    setCache(url, real);
    return real;
  }

  throw new Error('Failed to extract video. TikTok is temporarily unavailable or the video does not exist.');
}

export async function getDownloadUrl(videoUrl: string, quality: string): Promise<{ url: string; filename: string }> {
  const cached = getCached(videoUrl);
  const data = cached || await tryScraper(videoUrl);
  if (!data) {
    throw new Error('Failed to fetch video. Please try again later.');
  }

  if (!cached && data) setCache(videoUrl, data);

  const opt = data.downloadOptions.find(o => o.quality === quality);
  if (opt?.url) return { url: opt.url, filename: `${sanitizeFilename(data.title)}-${quality}` };

  if (data.downloadOptions[0]?.url) return { url: data.downloadOptions[0].url, filename: `${sanitizeFilename(data.title)}-${data.downloadOptions[0].quality}` };

  throw new Error('No download URL available for this video.');
}
