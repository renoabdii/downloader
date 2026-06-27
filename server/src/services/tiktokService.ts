import { VideoData, DownloadOption } from '../types/index.js';

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
    const resp = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' }, signal: AbortSignal.timeout(8000) });
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

interface TTSearchItem {
  id?: string;
  desc?: string;
  createTime?: number;
  video?: {
    id?: string;
    duration?: number;
    cover?: string;
    originCover?: string;
    playAddr?: string;
    downloadAddr?: string;
    width?: number;
    height?: number;
  };
  author?: {
    id?: string;
    uniqueId?: string;
    nickname?: string;
    avatarThumb?: string;
    avatarMedium?: string;
  };
  music?: {
    id?: string;
    title?: string;
    playUrl?: string;
  };
  stats?: {
    playCount?: number;
    diggCount?: number;
    commentCount?: number;
    shareCount?: number;
  };
  imagePost?: {
    images?: Array<{ imageURL?: { urlList?: string[] } }>;
  };
}

interface TTSearchResult {
  status_code?: number;
  itemInfo?: { itemStruct?: TTSearchItem };
  data?: string | { items?: TTSearchItem[] };
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
];

async function tryScraper(url: string): Promise<VideoData | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ua = USER_AGENTS[attempt % USER_AGENTS.length];
      const headers = {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.tiktok.com/',
      };

      const htmlResp = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (!htmlResp.ok) {
        if (attempt === 0) { await sleep(1500); continue; }
        return null;
      }

      const html = await htmlResp.text();

      const dataMatch = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__"\s+type="application\/json">({.*?})<\/script>/s)
        || html.match(/window\.__UNIVERSAL_DATA_FOR_VIEW__\s*=\s*({.*?});/s)
        || html.match(/<script\s+id="__UNIVERSAL_DATA_FOR_VIEW__"\s+type="application\/json">(.*?)<\/script>/s);

      let item: TTSearchItem | undefined;

      if (dataMatch) {
        try {
          const parsed = JSON.parse(dataMatch[1]);
          const scope = parsed?.__DEFAULT_SCOPE__;
          const videoDetail = scope?.['webapp.video-detail'];
          item = videoDetail?.itemInfo?.itemStruct
            || parsed?.ItemModule?.[Object.keys(parsed?.ItemModule || {})[0]]
            || parsed?.itemInfo?.itemStruct;
        } catch { }
      }

      if (!item) {
        const sigiMatch = html.match(/<script[^>]*>window\.SIGI_STATE\s*=\s*({.*?});<\/script>/s);
        if (sigiMatch) {
          try {
            const sigi = JSON.parse(sigiMatch[1]);
            const firstId = Object.keys(sigi?.ItemModule || {})[0];
            if (firstId) item = sigi.ItemModule[firstId];
          } catch { }
        }
      }

      if (!item) {
        if (attempt === 0) { await sleep(1500); continue; }
        return null;
      }

      const options: DownloadOption[] = [];

      const playAddr = item.video?.playAddr || item.video?.downloadAddr;
      if (playAddr) {
        options.push({ quality: 'no-watermark', label: 'Without Watermark', url: playAddr, size: 'N/A' });
      }

      if (item.video?.downloadAddr && item.video?.downloadAddr !== playAddr) {
        options.push({ quality: 'with-watermark', label: 'With Watermark', url: item.video.downloadAddr, size: 'N/A' });
      }

      if (item.music?.playUrl) {
        options.push({ quality: 'mp3', label: 'MP3 Audio', url: item.music.playUrl, size: 'N/A' });
      }

      if (item.imagePost?.images?.length) {
        item.imagePost.images.forEach((img, i) => {
          const imgUrl = img.imageURL?.urlList?.[0];
          if (imgUrl) {
            options.push({ quality: `photo-${i + 1}`, label: item.imagePost!.images!.length === 1 ? 'Download Image' : `Image ${i + 1}`, url: imgUrl, size: 'N/A' });
          }
        });
      }

      if (options.length === 0) {
        if (attempt === 0) { await sleep(1500); continue; }
        return null;
      }

      const sizes = await Promise.all(options.map(o => getFileSize(o.url)));
      sizes.forEach((s, i) => { options[i].size = s; });

      const dur = item.video?.duration
        ? `${Math.floor(item.video.duration / 60)}:${(item.video.duration % 60).toString().padStart(2, '0')}`
        : (item.imagePost?.images?.length ? `${item.imagePost.images.length} images` : 'N/A');

      return {
        id: item.id || 'unknown',
        title: item.desc || (item.imagePost?.images?.length ? 'TikTok Photo' : 'TikTok Video'),
        author: item.author?.nickname ? `@${item.author.nickname}` : '@unknown',
        authorAvatar: item.author?.avatarMedium || item.author?.avatarThumb || `https://api.dicebear.com/8.x/avataaars/svg?seed=unknown`,
        thumbnail: item.video?.originCover || item.video?.cover || `https://picsum.photos/seed/${item.id}/640/360`,
        duration: dur,
        views: fmtCount(item.stats?.playCount),
        likes: fmtCount(item.stats?.diggCount),
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
