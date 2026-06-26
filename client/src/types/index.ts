export interface DownloadOption {
  quality: string;
  label: string;
  url: string;
  size: string;
}

export interface VideoData {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  downloadOptions: DownloadOption[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  videoId: string;
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  quality: string;
  timestamp: number;
}

export type DownloadState = 'idle' | 'loading' | 'success' | 'error';
