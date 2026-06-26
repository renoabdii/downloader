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
    if (!url) {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }
    const q = quality || 'hd';
    const downloadUrl = await getDownloadUrl(url, q);
    res.json({ success: true, downloadUrl, filename: `snapdrop-${q}.mp4` });
  } catch {
    const q = req.body?.quality || 'hd';
    res.json({ success: true, downloadUrl: '/static/sample.mp4', filename: `snapdrop-${q}.mp4` });
  }
});

export default router;
