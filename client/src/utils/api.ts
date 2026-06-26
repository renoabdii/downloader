import { ApiResponse, VideoData } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchVideoInfo(url: string): Promise<VideoData> {
  const res = await fetch(`${BASE_URL}/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data: ApiResponse<VideoData> = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch video info');
  return data.data!;
}

export async function getDownloadUrl(url: string, quality: string): Promise<{ downloadUrl: string; filename: string }> {
  const res = await fetch(`${BASE_URL}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, quality }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to get download URL');
  return { downloadUrl: data.downloadUrl, filename: data.filename };
}
