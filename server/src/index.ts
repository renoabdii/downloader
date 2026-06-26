import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import downloadRoutes from './routes/download.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

app.use('/static', express.static(path.join(__dirname, '..', 'public')));

app.use('/api', downloadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
