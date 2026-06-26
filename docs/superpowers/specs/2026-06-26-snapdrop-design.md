# SnapDrop — TikTok Downloader Web App

## Overview
SnapDrop is a modern TikTok video downloader web application with a Neo Brutalism design style. Users paste a TikTok URL and get download options (HD, SD, No Watermark, With Watermark, MP3).

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + TypeScript
- **Design:** Neo Brutalism (4px black borders, bold typography, flat UI, thick shadows)

## Architecture
Monorepo with two packages: `client/` and `server/` under a root workspace.

### Project Structure
```
snapdrop/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI (Button, Card, Input, Navbar, Footer)
│   │   ├── features/
│   │   │   ├── downloader/   # URL input, validation, video preview, download options
│   │   │   ├── history/      # Download history management (localStorage)
│   │   │   ├── theme/        # Dark/light mode toggle + ThemeProvider
│   │   │   └── hero/         # Hero section
│   │   ├── hooks/            # Custom hooks (useLocalStorage, useTheme, useDownload)
│   │   ├── types/            # Shared TS interfaces
│   │   ├── utils/            # Validators, formatters
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/           # /api/download, /api/info
│   │   ├── services/         # MockDownloader service (swappable)
│   │   ├── middleware/       # Error handling, CORS
│   │   ├── types/
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
├── package.json              # Root workspace
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

### Data Flow
1. User pastes TikTok URL → client validates format → POST `/api/info`
2. Server returns mock video data: `{ id, title, author, thumbnail, duration, downloadOptions[] }`
3. Frontend renders preview card with thumbnail, title, author
4. User selects quality: HD, SD, No Watermark, With Watermark, MP3
5. "Download" triggers browser download via blob URL; "Copy Link" copies to clipboard
6. Download entry saved to localStorage history

## Component Tree
```
App
├── ThemeProvider
│   ├── Navbar (sticky, logo "SnapDrop", dark/light toggle)
│   ├── Hero (heading, subtitle, decorative doodles)
│   ├── DownloaderCard
│   │   ├── URLInput (paste field + validate button)
│   │   ├── LoadingState (pulsing skeleton)
│   │   ├── ErrorState (retry card)
│   │   ├── EmptyState (instructional)
│   │   └── VideoPreview
│   │       ├── Thumbnail
│   │       ├── VideoInfo (title, author, stats)
│   │       └── DownloadOptions (grid of quality buttons)
│   ├── HistorySection
│   │   ├── HistoryItem (per download entry)
│   │   └── ClearHistoryButton
│   ├── FeaturesSection (3-4 feature cards)
│   ├── FAQ (3-4 questions)
│   └── Footer
```

## Neo Brutalism Design Tokens
- **Font:** Space Grotesk (Google Fonts)
- **Borders:** 4px solid black on all cards, buttons, inputs
- **Shadows:** 8px 8px 0px 0px rgba(0,0,0,1)
- **Border radius:** 0px (sharp)
- **Colors (Light):** bg-amber-50, text-gray-900, accent colors per card
- **Colors (Dark):** bg-gray-900, text-gray-100, dark card backgrounds
- **Buttons:** Large, bold, colored backgrounds, pressed animation (translateY(2px))
- **Doodles:** CSS-drawn stars, arrows, smileys as decorative elements
- **Animations:** Framer Motion for mount, hover, and transition effects

## API Endpoints
### `POST /api/info`
Request: `{ url: string }`
Response: `{ success: boolean, data: VideoData }` or `{ success: false, error: string }`

### `POST /api/download`
Request: `{ url: string, quality: 'hd' | 'sd' | 'no-watermark' | 'with-watermark' | 'mp3' }`
Response: Binary file download or `{ downloadUrl: string }`

## States
Every component handles: **loading** (skeleton/pulse), **empty** (illustration + message), **error** (retry action), **success** (normal render).

## Responsive Breakpoints
- Mobile: < 640px (single column, compact)
- Tablet: 640-1024px (two columns)
- Desktop: > 1024px (full layout)

## History
- Stored in localStorage under key `snapdrop-history`
- Max 50 entries
- Each entry: `{ id, url, title, author, thumbnail, quality, timestamp }`
