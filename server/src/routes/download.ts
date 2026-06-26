import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { extractVideoInfo, getDownloadUrl } from '../services/tiktokService.js';

const router = Router();

const infoSchema = z.object({
  url: z.string().min(1, 'URL is required'),
});

const downloadSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  quality: z.string().optional().default('no-watermark'),
});

router.post('/info', async (req: Request, res: Response) => {
  try {
    const { url } = infoSchema.parse(req.body);
    const data = await extractVideoInfo(url);
    res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.issues[0].message });
      return;
    }
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process video',
    });
  }
});

router.post('/download', async (req: Request, res: Response) => {
  try {
    const { url, quality } = downloadSchema.parse(req.body);
    const { url: downloadUrl, filename } = await getDownloadUrl(url, quality);
    const ext = quality === 'mp3' ? '.mp3' : quality.startsWith('photo') ? '.jpg' : '.mp4';
    res.json({ success: true, downloadUrl, filename: `${filename}${ext}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.issues[0].message });
      return;
    }
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get download URL',
    });
  }
});

export default router;
