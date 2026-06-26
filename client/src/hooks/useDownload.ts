import { useState, useCallback } from 'react';
import { VideoData, DownloadState } from '../types';
import { isValidTikTokUrl, sanitizeUrl } from '../utils/validators';
import { fetchVideoInfo } from '../utils/api';

export function useDownload() {
  const [state, setState] = useState<DownloadState>('idle');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const download = useCallback(async (url: string) => {
    const clean = sanitizeUrl(url);
    if (!clean) {
      setError('Please enter a TikTok video URL');
      setState('error');
      return;
    }
    if (!isValidTikTokUrl(clean)) {
      setError('Invalid TikTok URL. Please paste a valid TikTok video link.');
      setState('error');
      return;
    }
    setState('loading');
    setError('');
    setVideoData(null);
    setCurrentUrl(clean);
    try {
      const data = await fetchVideoInfo(clean);
      setVideoData(data);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setVideoData(null);
    setError('');
    setCurrentUrl('');
  }, []);

  return { state, videoData, error, currentUrl, download, reset };
}
