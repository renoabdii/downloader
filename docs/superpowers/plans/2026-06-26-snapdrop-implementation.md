# SnapDrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete TikTok downloader web app called "SnapDrop" with Neo Brutalism design, React frontend, and Express backend.

**Architecture:** Monorepo with `client/` (Vite+React+TS+Tailwind+Framer Motion) and `server/` (Express+TS) packages. Server provides mock download API. Client handles UI, validation, history (localStorage), dark/light mode.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion, Node.js, Express, ts-node, concurrently

## Global Constraints
- 4px solid black borders on all cards, buttons, inputs
- Sharp corners (border-radius: 0)
- Space Grotesk font throughout
- Neo Brutalism: 8px 8px 0px 0px black box-shadow
- Dark mode: bg-gray-900, Light mode: bg-amber-50
- All components handle loading, empty, error, success states
- Framer Motion for all animations
- Responsive: mobile (<640px), tablet (640-1024px), desktop (>1024px)

---
### Task 1: Root Monorepo + Package Scaffolding

**Files:**
- Create: `D:\kuliah\randomproject\downloader\package.json`
- Create: `D:\kuliah\randomproject\downloader\.eslintrc.cjs`
- Create: `D:\kuliah\randomproject\downloader\.prettierrc`
- Create: `D:\kuliah\randomproject\downloader\.gitignore`
- Create: `D:\kuliah\randomproject\downloader\client\package.json`
- Create: `D:\kuliah\randomproject\downloader\client\tsconfig.json`
- Create: `D:\kuliah\randomproject\downloader\client\tsconfig.node.json`
- Create: `D:\kuliah\randomproject\downloader\client\vite.config.ts`
- Create: `D:\kuliah\randomproject\downloader\client\tailwind.config.js`
- Create: `D:\kuliah\randomproject\downloader\client\postcss.config.js`
- Create: `D:\kuliah\randomproject\downloader\client\index.html`
- Create: `D:\kuliah\randomproject\downloader\server\package.json`
- Create: `D:\kuliah\randomproject\downloader\server\tsconfig.json`

- [ ] Step 1: Create root package.json (workspace config)

```json
{
  "name": "snapdrop",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run dev --workspace=server",
    "build": "npm run build --workspace=server && npm run build --workspace=client",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "workspaces": ["client", "server"],
  "devDependencies": {
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5"
  }
}
```

- [ ] Step 2: Create root .eslintrc.cjs

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

- [ ] Step 3: Create root .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] Step 4: Create root .gitignore

```
node_modules/
dist/
.env
*.local
```

- [ ] Step 5: Create client/package.json

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.2.10",
    "react-icons": "^5.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.3.1"
  }
}
```

- [ ] Step 6: Create client/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] Step 7: Create client/tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] Step 8: Create client/vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] Step 9: Create client/tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        brutal: '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] Step 10: Create client/postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] Step 11: Create client/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>SnapDrop - TikTok Video Downloader</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] Step 12: Create server/package.json

```json
{
  "name": "server",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.15.6",
    "typescript": "^5.4.5"
  }
}
```

- [ ] Step 13: Create server/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

- [ ] Step 14: Install all dependencies

```bash
cd D:\kuliah\randomproject\downloader
npm install
```

---
### Task 2: Server - Express + Mock API

**Files:**
- Create: `D:\kuliah\randomproject\downloader\server\src\index.ts`
- Create: `D:\kuliah\randomproject\downloader\server\src\types\index.ts`
- Create: `D:\kuliah\randomproject\downloader\server\src\services\mockDownloader.ts`
- Create: `D:\kuliah\randomproject\downloader\server\src\routes\download.ts`

- [ ] Step 1: Create server types

```ts
// server/src/types/index.ts
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
```

- [ ] Step 2: Create mock downloader service

```ts
// server/src/services/mockDownloader.ts
import { VideoData } from '../types/index.js';

const mockVideos: VideoData[] = [
  {
    id: 'tiktok-mock-001',
    title: 'When your code works on the first try 🔥 #programming #developer',
    author: '@codinglife',
    authorAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=codinglife',
    thumbnail: 'https://picsum.photos/seed/video1/640/360',
    duration: '0:32',
    views: '2.5M',
    likes: '892K',
    downloadOptions: [
      { quality: 'hd', label: 'HD (1080p)', url: 'https://example.com/mock/hd.mp4', size: '12.4 MB' },
      { quality: 'sd', label: 'SD (720p)', url: 'https://example.com/mock/sd.mp4', size: '6.2 MB' },
      { quality: 'no-watermark', label: 'Without Watermark', url: 'https://example.com/mock/nowm.mp4', size: '8.1 MB' },
      { quality: 'with-watermark', label: 'With Watermark', url: 'https://example.com/mock/watermark.mp4', size: '8.5 MB' },
      { quality: 'mp3', label: 'MP3 Audio', url: 'https://example.com/mock/audio.mp3', size: '3.1 MB' },
    ],
  },
  {
    id: 'tiktok-mock-002',
    title: 'My cat reacting to cucumber 🐱 #cats #funny',
    author: '@petlover',
    authorAvatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=petlover',
    thumbnail: 'https://picsum.photos/seed/video2/640/360',
    duration: '0:15',
    views: '5.1M',
    likes: '1.2M',
    downloadOptions: [
      { quality: 'hd', label: 'HD (1080p)', url: 'https://example.com/mock/hd2.mp4', size: '8.2 MB' },
      { quality: 'sd', label: 'SD (720p)', url: 'https://example.com/mock/sd2.mp4', size: '4.1 MB' },
      { quality: 'no-watermark', label: 'Without Watermark', url: 'https://example.com/mock/nowm2.mp4', size: '5.3 MB' },
      { quality: 'with-watermark', label: 'With Watermark', url: 'https://example.com/mock/watermark2.mp4', size: '5.7 MB' },
      { quality: 'mp3', label: 'MP3 Audio', url: 'https://example.com/mock/audio2.mp3', size: '2.1 MB' },
    ],
  },
];

export function getMockVideoData(url: string): Promise<VideoData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isValid = url.includes('tiktok.com') || url.includes('vm.tiktok');
      if (!isValid) {
        reject(new Error('Invalid TikTok URL. Please enter a valid TikTok video URL.'));
        return;
      }
      const randomIndex = Math.floor(Math.random() * mockVideos.length);
      resolve({ ...mockVideos[randomIndex] });
    }, 1500);
  });
}

export function getMockDownloadUrl(_url: string, quality: string): string {
  const video = mockVideos[0];
  const option = video.downloadOptions.find((o) => o.quality === quality);
  return option?.url || video.downloadOptions[0].url;
}
```

- [ ] Step 3: Create download routes

```ts
// server/src/routes/download.ts
import { Router, Request, Response } from 'express';
import { getMockVideoData, getMockDownloadUrl } from '../services/mockDownloader.js';

const router = Router();

router.post('/info', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }
    const data = await getMockVideoData(url);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process video',
    });
  }
});

router.post('/download', (req: Request, res: Response) => {
  const { url, quality } = req.body;
  if (!url) {
    res.status(400).json({ success: false, error: 'URL is required' });
    return;
  }
  const downloadUrl = getMockDownloadUrl(url, quality || 'hd');
  res.json({ success: true, downloadUrl });
});

export default router;
```

- [ ] Step 4: Create server entry point

```ts
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import downloadRoutes from './routes/download.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', downloadRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---
### Task 3: Client - Entry Point + Global Styles + Types

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\main.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\App.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\index.css`
- Create: `D:\kuliah\randomproject\downloader\client\src\vite-env.d.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\types\index.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\utils\validators.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\utils\formatters.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\utils\api.ts`
- Create: `D:\kuliah\randomproject\downloader\client\public\favicon.svg`

- [ ] Step 1: Create vite-env.d.ts

```ts
// client/src/vite-env.d.ts
/// <reference types="vite/client" />
```

- [ ] Step 2: Create favicon

```svg
<!-- client/public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">⬇️</text>
</svg>
```

- [ ] Step 3: Create global CSS

```css
/* client/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans bg-amber-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 font-bold text-lg bg-yellow-400 border-4 border-black 
           shadow-brutal hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px]
           active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
           transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply px-6 py-3 font-bold text-lg bg-white border-4 border-black 
           shadow-brutal hover:shadow-brutal-lg hover:translate-x-[-2px] hover:translate-y-[-2px]
           active:translate-x-[6px] active:translate-y-[6px] active:shadow-none
           transition-all duration-100 dark:bg-gray-800 dark:text-white;
  }
  .btn-download {
    @apply px-4 py-2 font-bold text-sm border-4 border-black 
           shadow-brutal-sm hover:shadow-brutal hover:translate-x-[-1px] hover:translate-y-[-1px]
           active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
           transition-all duration-100;
  }
  .card {
    @apply border-4 border-black shadow-brutal bg-white dark:bg-gray-800 dark:text-white;
  }
  .input-brutal {
    @apply w-full px-4 py-3 text-lg border-4 border-black bg-white dark:bg-gray-800 dark:text-white
           shadow-brutal-sm focus:shadow-brutal focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px]
           transition-all duration-100;
  }
}
```

- [ ] Step 4: Create types

```ts
// client/src/types/index.ts
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
```

- [ ] Step 5: Create validators

```ts
// client/src/utils/validators.ts
export function isValidTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
    /^https?:\/\/(vm\.|vt\.)?tiktok\.com\/[\w]+\/?/i,
    /^https?:\/\/m\.tiktok\.com\/v\/\d+/i,
  ];
  return patterns.some((pattern) => pattern.test(url.trim()));
}

export function sanitizeUrl(url: string): string {
  return url.trim();
}
```

- [ ] Step 6: Create formatters

```ts
// client/src/utils/formatters.ts
export function formatNumber(num: string): string {
  const n = parseFloat(num.replace(/[^0-9.]/g, ''));
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return num;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
```

- [ ] Step 7: Create API utility

```ts
// client/src/utils/api.ts
import { ApiResponse, VideoData } from '../types';

const BASE_URL = '/api';

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

export async function getDownloadUrl(url: string, quality: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, quality }),
  });
  const data: ApiResponse<{ downloadUrl: string }> = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to get download URL');
  return data.data!.downloadUrl;
}
```

- [ ] Step 8: Create main.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] Step 9: Create App.tsx

```tsx
import { ThemeProvider } from './features/theme/ThemeProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './features/hero/Hero';
import { DownloaderCard } from './features/downloader/DownloaderCard';
import { HistorySection } from './features/history/HistorySection';
import { FeaturesSection } from './features/hero/FeaturesSection';
import { FAQ } from './features/hero/FAQ';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <DownloaderCard />
          <HistorySection />
          <FeaturesSection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
```

---
### Task 4: Theme System

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\features\theme\ThemeContext.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\theme\ThemeProvider.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\theme\useTheme.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\theme\ThemeToggle.tsx`

- [ ] Step 1: Create ThemeContext

```tsx
import { createContext } from 'react';

export interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
});
```

- [ ] Step 2: Create ThemeProvider

```tsx
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('snapdrop-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('snapdrop-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- [ ] Step 3: Create useTheme hook

```tsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  return useContext(ThemeContext);
}
```

- [ ] Step 4: Create ThemeToggle

```tsx
import { motion } from 'framer-motion';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      className="p-2 border-4 border-black bg-white dark:bg-gray-800 shadow-brutal-sm hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </motion.button>
  );
}
```

---
### Task 5: Navbar + Footer Components

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\components\Navbar.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\components\Footer.tsx`

- [ ] Step 1: Create Navbar

```tsx
import { motion } from 'framer-motion';
import { ThemeToggle } from '../features/theme/ThemeToggle';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-yellow-400 border-b-4 border-black dark:bg-yellow-600"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a
          href="/"
          className="text-2xl font-bold tracking-tighter"
          whileHover={{ scale: 1.05 }}
        >
          ⬇️ SnapDrop
        </motion.a>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium">
            TikTok Downloader
          </span>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] Step 2: Create Footer

```tsx
export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white dark:bg-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-sm font-medium">
          ⬇️ SnapDrop &copy; {new Date().getFullYear()} &mdash; TikTok Video Downloader
        </p>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Not affiliated with TikTok. For personal use only.
        </p>
      </div>
    </footer>
  );
}
```

---
### Task 6: Hero Section

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\features\hero\Hero.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\hero\Doodles.tsx`

- [ ] Step 1: Create Doodles component

```tsx
import { motion } from 'framer-motion';

function Doodle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={`absolute text-2xl select-none ${className}`}
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  );
}

export function Doodles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Doodle className="top-4 left-[15%]">⭐</Doodle>
      <Doodle className="top-8 right-[20%]">✨</Doodle>
      <Doodle className="bottom-12 left-[10%]">🎯</Doodle>
      <Doodle className="bottom-4 right-[15%]">😎</Doodle>
      <Doodle className="top-1/2 left-[5%]">⬇️</Doodle>
      <Doodle className="top-1/3 right-[8%]">🔥</Doodle>
    </div>
  );
}
```

- [ ] Step 2: Create Hero section

```tsx
import { motion } from 'framer-motion';
import { Doodles } from './Doodles';

export function Hero() {
  return (
    <section className="relative bg-cyan-400 border-b-4 border-black dark:bg-cyan-700 overflow-hidden">
      <Doodles />
      <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4"
        >
          Download Any
          <br />
          <span className="text-yellow-300 dark:text-yellow-200">TikTok Video</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl font-medium max-w-2xl mx-auto"
        >
          Paste a TikTok URL and download videos in HD, without watermark, or as MP3.
          Free, fast, and no sign-up required.
        </motion.p>
      </div>
    </section>
  );
}
```

---
### Task 7: Downloader Card (URL Input + States + Video Preview)

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\DownloaderCard.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\URLInput.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\LoadingState.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\ErrorState.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\EmptyState.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\VideoPreview.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\downloader\DownloadOptions.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\hooks\useDownload.ts`

- [ ] Step 1: Create useDownload hook

```tsx
import { useState, useCallback } from 'react';
import { VideoData, DownloadState } from '../../types';
import { isValidTikTokUrl, sanitizeUrl } from '../../utils/validators';
import { fetchVideoInfo } from '../../utils/api';

export function useDownload() {
  const [state, setState] = useState<DownloadState>('idle');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string>('');

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
  }, []);

  return { state, videoData, error, download, reset };
}
```

- [ ] Step 2: Create URLInput

```tsx
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoading) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tiktok-url" className="block text-sm font-bold mb-2">
          Paste TikTok Video URL
        </label>
        <input
          id="tiktok-url"
          type="url"
          placeholder="https://www.tiktok.com/@user/video/123456789"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-brutal"
          disabled={isLoading}
        />
      </div>
      <motion.button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading || !url.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? 'Processing...' : '⬇️ Get Video'}
      </motion.button>
    </form>
  );
}
```

- [ ] Step 3: Create LoadingState

```tsx
import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-6 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse border-2 border-black w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 animate-pulse border-2 border-black w-1/2" />
        </div>
      </div>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse border-4 border-black" />
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] Step 4: Create ErrorState

```tsx
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 text-center border-red-500"
    >
      <div className="text-4xl mb-4">😵</div>
      <h3 className="text-lg font-bold mb-2">Oops!</h3>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </motion.div>
  );
}
```

- [ ] Step 5: Create EmptyState

```tsx
import { motion } from 'framer-motion';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-8 text-center"
    >
      <div className="text-5xl mb-4">🎬</div>
      <h3 className="text-xl font-bold mb-2">Ready to Download</h3>
      <p className="text-sm">
        Paste a TikTok video URL above and click &quot;Get Video&quot; to start.
      </p>
      <div className="mt-4 flex justify-center gap-2 text-2xl">
        <span>⬇️</span>
        <span>🎵</span>
        <span>🎥</span>
      </div>
    </motion.div>
  );
}
```

- [ ] Step 6: Create DownloadOptions

```tsx
import { motion } from 'framer-motion';
import { DownloadOption } from '../../types';

interface DownloadOptionsProps {
  options: DownloadOption[];
  onDownload: (option: DownloadOption) => void;
  onCopyLink: (option: DownloadOption) => void;
}

const qualityColors: Record<string, string> = {
  hd: 'bg-green-400',
  sd: 'bg-blue-400',
  'no-watermark': 'bg-purple-400',
  'with-watermark': 'bg-orange-400',
  mp3: 'bg-pink-400',
};

export function DownloadOptions({ options, onDownload, onCopyLink }: DownloadOptionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {options.map((option, i) => (
        <motion.div
          key={option.quality}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${qualityColors[option.quality] || 'bg-gray-300'} border-4 border-black p-3`}
        >
          <div className="text-xs font-bold mb-1">{option.label}</div>
          <div className="text-xs mb-2">{option.size}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(option)}
              className="btn-download bg-black text-white flex-1 text-xs"
            >
              ⬇️ Download
            </button>
            <button
              onClick={() => onCopyLink(option)}
              className="btn-download bg-white dark:bg-gray-700 flex-1 text-xs"
            >
              📋 Copy
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] Step 7: Create VideoPreview

```tsx
import { motion } from 'framer-motion';
import { VideoData, DownloadOption } from '../../types';
import { DownloadOptions } from './DownloadOptions';
import { formatNumber } from '../../utils/formatters';

interface VideoPreviewProps {
  data: VideoData;
  onDownload: (option: DownloadOption) => void;
  onCopyLink: (option: DownloadOption) => void;
}

export function VideoPreview({ data, onDownload, onCopyLink }: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="aspect-video relative border-b-4 border-black">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 border-2 border-white">
          {data.duration}
        </span>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <img
            src={data.authorAvatar}
            alt={data.author}
            className="w-10 h-10 border-2 border-black flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2">
              {data.title}
            </h3>
            <p className="text-sm font-medium mt-1">{data.author}</p>
            <div className="flex gap-4 text-xs mt-1 text-gray-500 dark:text-gray-400">
              <span>👁️ {formatNumber(data.views)} views</span>
              <span>❤️ {formatNumber(data.likes)} likes</span>
            </div>
          </div>
        </div>
        <DownloadOptions
          options={data.downloadOptions}
          onDownload={onDownload}
          onCopyLink={onCopyLink}
        />
      </div>
    </motion.div>
  );
}
```

- [ ] Step 8: Create DownloaderCard (main orchestrator)

```tsx
import { motion } from 'framer-motion';
import { URLInput } from './URLInput';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { VideoPreview } from './VideoPreview';
import { useDownload } from '../../hooks/useDownload';
import { DownloadOption } from '../../types';
import { getDownloadUrl } from '../../utils/api';
import { useHistory } from '../../hooks/useHistory';

export function DownloaderCard() {
  const { state, videoData, error, download, reset } = useDownload();
  const { addEntry } = useHistory();

  const handleDownload = async (option: DownloadOption) => {
    try {
      const url = await getDownloadUrl('mock', option.quality);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapdrop-${option.quality}.mp4`;
      a.click();
    } catch {
      alert('Download link generated (mock mode). In production, this would download the file.');
    }
  };

  const handleCopyLink = async (option: DownloadOption) => {
    try {
      await navigator.clipboard.writeText(option.url);
      alert('Download link copied to clipboard!');
    } catch {
      alert('Failed to copy link');
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 space-y-6"
      >
        <URLInput onSubmit={download} isLoading={state === 'loading'} />

        {state === 'loading' && <LoadingState />}
        {state === 'error' && <ErrorState message={error} onRetry={reset} />}
        {state === 'idle' && <EmptyState />}
        {state === 'success' && videoData && (
          <VideoPreview
            data={videoData}
            onDownload={(option) => {
              addEntry({
                videoId: videoData.id,
                url: 'mock-url',
                title: videoData.title,
                author: videoData.author,
                thumbnail: videoData.thumbnail,
                quality: option.quality,
              });
              handleDownload(option);
            }}
            onCopyLink={(option) => {
              addEntry({
                videoId: videoData.id,
                url: 'mock-url',
                title: videoData.title,
                author: videoData.author,
                thumbnail: videoData.thumbnail,
                quality: option.quality,
              });
              handleCopyLink(option);
            }}
          />
        )}
      </motion.div>
    </section>
  );
}
```

---
### Task 8: History Feature

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\hooks\useHistory.ts`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\history\HistorySection.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\history\HistoryItem.tsx`

- [ ] Step 1: Create useHistory hook

```tsx
import { useState, useEffect, useCallback } from 'react';
import { HistoryEntry } from '../../types';

const STORAGE_KEY = 'snapdrop-history';
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setEntries((prev) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      return [newEntry, ...prev].slice(0, MAX_ENTRIES);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, clearHistory };
}
```

- [ ] Step 2: Create HistoryItem

```tsx
import { motion } from 'framer-motion';
import { HistoryEntry } from '../../types';
import { formatDate } from '../../utils/formatters';

interface HistoryItemProps {
  entry: HistoryEntry;
  index: number;
}

export function HistoryItem({ entry, index }: HistoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 border-4 border-black bg-white dark:bg-gray-800 shadow-brutal-sm"
    >
      <img
        src={entry.thumbnail}
        alt={entry.title}
        className="w-14 h-14 object-cover border-2 border-black flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{entry.title}</p>
        <p className="text-xs">{entry.author}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.timestamp)}</p>
      </div>
      <span className="text-xs font-bold px-2 py-1 border-2 border-black bg-yellow-300 capitalize">
        {entry.quality}
      </span>
    </motion.div>
  );
}
```

- [ ] Step 3: Create HistorySection

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useHistory } from '../../hooks/useHistory';
import { HistoryItem } from './HistoryItem';

export function HistorySection() {
  const { entries, clearHistory } = useHistory();

  if (entries.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black tracking-tight">📋 History</h2>
        <button onClick={clearHistory} className="btn-secondary text-sm px-4 py-2">
          Clear All
        </button>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {entries.map((entry, i) => (
            <HistoryItem key={entry.id} entry={entry} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
```

---
### Task 9: Features + FAQ Sections

**Files:**
- Create: `D:\kuliah\randomproject\downloader\client\src\features\hero\FeaturesSection.tsx`
- Create: `D:\kuliah\randomproject\downloader\client\src\features\hero\FAQ.tsx`

- [ ] Step 1: Create FeaturesSection

```tsx
import { motion } from 'framer-motion';

const features = [
  {
    icon: '⚡',
    title: 'Fast Download',
    desc: 'Get your TikTok videos in seconds with our high-speed processing.',
    color: 'bg-green-400',
  },
  {
    icon: '🎨',
    title: 'HD Quality',
    desc: 'Download in up to 1080p HD quality, no watermark option available.',
    color: 'bg-purple-400',
  },
  {
    icon: '🎵',
    title: 'MP3 Support',
    desc: 'Extract audio from TikTok videos and save as MP3 files.',
    color: 'bg-pink-400',
  },
  {
    icon: '🔒',
    title: 'No Sign-Up',
    desc: 'No registration required. Free to use for everyone.',
    color: 'bg-cyan-400',
  },
];

export function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-10"
      >
        Why SnapDrop?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`${f.color} border-4 border-black p-6 shadow-brutal`}
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] Step 2: Create FAQ

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Is SnapDrop free to use?',
    a: 'Yes! SnapDrop is completely free. No sign-up or payment required.',
  },
  {
    q: 'How do I download a TikTok video?',
    a: 'Copy the TikTok video URL, paste it into the input above, and click "Get Video". Choose your preferred quality and download.',
  },
  {
    q: 'Can I download without watermark?',
    a: 'Yes! Select the "Without Watermark" option in the download choices.',
  },
  {
    q: 'Is this affiliated with TikTok?',
    a: 'No, SnapDrop is an independent tool and is not affiliated with TikTok or ByteDance.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-10"
      >
        ❓ FAQ
      </motion.h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left font-bold"
            >
              <span>{faq.q}</span>
              <span className="text-xl">{openIndex === i ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm font-medium border-t-4 border-black pt-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

---
