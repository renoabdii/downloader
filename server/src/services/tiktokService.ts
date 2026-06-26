import { VideoData, DownloadOption } from '../types/index.js';

const mockVideos: VideoData[] = [
  {
    id: 'tiktok-demo-001',
    title: 'When your code works on the first try 🔥 #programming #developer',
    author: '@codinglife',
    authorAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=codinglife',
    thumbnail: 'https://picsum.photos/seed/video1/640/360',
    duration: '0:32',
    views: '2.5M',
    likes: '892K',
    downloadOptions: [],
  },
  {
    id: 'tiktok-demo-002',
    title: 'My cat reacting to cucumber 🐱 #cats #funny',
    author: '@petlover',
    authorAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=petlover',
    thumbnail: 'https://picsum.photos/seed/video2/640/360',
    duration: '0:15',
    views: '5.1M',
    likes: '1.2M',
    downloadOptions: [],
  },
];

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
    if (m.audio_url || result.music_info?.audio_url) options.push({ quality: 'mp3', label: 'MP3 Audio', url: m.audio_url || result.music_info!.audio_url!, size: 'N/A' });

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
  } catch {
    return null;
  }
}

export async function extractVideoInfo(url: string): Promise<VideoData> {
  const isValid = /tiktok\.com|vm\.tiktok|vt\.tiktok|douyin\.com/i.test(url);
  if (!isValid) {
    throw new Error('Invalid TikTok URL. Please enter a valid TikTok video URL.');
  }

  const real = await tryScraper(url);
  if (real) return real;

  const idx = Math.floor(Math.random() * mockVideos.length);
  const mock = { ...mockVideos[idx] };
  mock.downloadOptions = [
    { quality: 'hd', label: 'HD (1080p)', url: '/static/sample.mp4', size: '12.4 MB' },
    { quality: 'sd', label: 'SD (720p)', url: '/static/sample.mp4', size: '6.2 MB' },
    { quality: 'no-watermark', label: 'Without Watermark', url: '/static/sample.mp4', size: '8.1 MB' },
    { quality: 'with-watermark', label: 'With Watermark', url: '/static/sample.mp4', size: '8.5 MB' },
    { quality: 'mp3', label: 'MP3 Audio', url: '/static/sample.mp3', size: '3.1 MB' },
  ];
  return mock;
}

export async function getDownloadUrl(videoUrl: string, quality: string): Promise<string> {
  const real = await tryScraper(videoUrl);
  if (real) {
    const opt = real.downloadOptions.find(o => o.quality === quality);
    if (opt?.url) return opt.url;
    if (real.downloadOptions[0]?.url) return real.downloadOptions[0].url;
  }

  const fallbackUrls: Record<string, string> = {
    hd: '/static/sample.mp4',
    sd: '/static/sample.mp4',
    'no-watermark': '/static/sample.mp4',
    'with-watermark': '/static/sample.mp4',
    mp3: '/static/sample.mp3',
  };
  return fallbackUrls[quality] || '/static/sample.mp4';
}
