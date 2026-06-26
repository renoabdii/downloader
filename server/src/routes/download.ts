import { Router, Request, Response } from 'express';
import { extractVideoInfo, getDownloadUrl } from '../services/tiktokService.js';

const router = Router();

router.post('/info', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }

    const data = await extractVideoInfo(url);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process video',
    });
  }
});

router.post('/download', async (req: Request, res: Response) => {
  try {
    const { url, quality } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }
    const q = quality || 'no-watermark';
    const { url: downloadUrl, filename } = await getDownloadUrl(url, q);
    const ext = q === 'mp3' ? '.mp3' : q.startsWith('photo') ? '.jpg' : '.mp4';
    res.json({ success: true, downloadUrl, filename: `${filename}${ext}` });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get download URL',
    });
  }
});

export default router;
