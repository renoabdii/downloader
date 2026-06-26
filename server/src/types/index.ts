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
