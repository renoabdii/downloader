import { VideoData, DownloadOption } from '../types/index.js';
import { createRequire } from 'module';

const _require = createRequire(import.meta.url);

function fmtCount(n?: string | number): string {
  if (!n) return 'N/A';
  const num = typeof n === 'string' ? parseInt(n, 10) : n;
  if (isNaN(num)) return 'N/A';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'K';
  return num.toString();
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
      const { Downloader } = _require('@tobyg74/tiktok-api-dl');
      const result = await Downloader(url, { version: 'v3' });

      if (result?.status !== 'success' || !result.result) {
        if (attempt === 0) await sleep(1500);
        continue;
      }

      const r = result.result;
      const options: DownloadOption[] = [];

      if (r.videoWatermark) {
        options.push({ quality: 'with-watermark', label: 'With Watermark', url: r.videoWatermark, size: 'N/A' });
      }

      if (r.videoHD) {
        options.push({ quality: 'no-watermark', label: 'Without Watermark', url: r.videoHD, size: 'N/A' });
      } else if (r.videoSD) {
        options.push({ quality: 'no-watermark', label: 'Without Watermark', url: r.videoSD, size: 'N/A' });
      }

      if (r.music?.playUrl?.[0]) {
        options.push({ quality: 'mp3', label: 'MP3 Audio', url: r.music.playUrl[0], size: 'N/A' });
      }

      if (r.images?.length) {
        r.images.forEach((imgUrl: string, i: number) => {
          options.push({ quality: `photo-${i + 1}`, label: r.images.length === 1 ? 'Download Image' : `Image ${i + 1}`, url: imgUrl, size: 'N/A' });
        });
      }

      if (options.length === 0) return null;

      const sizes = await Promise.all(options.map(o => getFileSize(o.url)));
      sizes.forEach((s, i) => { options[i].size = s; });

      return {
        id: r.id || 'unknown',
        title: r.desc || (r.images?.length ? 'TikTok Photo' : 'TikTok Video'),
        author: r.author?.nickname || '@unknown',
        authorAvatar: r.author?.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=unknown`,
        thumbnail: r.video?.cover?.[0] || r.video?.originCover?.[0] || `https://picsum.photos/seed/${r.id}/640/360`,
        duration: r.video?.duration ? `${Math.floor(r.video.duration / 60)}:${(r.video.duration % 60).toString().padStart(2, '0')}` : (r.images?.length ? `${r.images.length} images` : 'N/A'),
        views: fmtCount(r.statistics?.playCount),
        likes: fmtCount(r.statistics?.likeCount),
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
  if (opt?.url) return { url: opt.url, filename: `snapdrop-${quality}` };

  if (data.downloadOptions[0]?.url) return { url: data.downloadOptions[0].url, filename: `snapdrop-${data.downloadOptions[0].quality}` };

  throw new Error('No download URL available for this video.');
}
