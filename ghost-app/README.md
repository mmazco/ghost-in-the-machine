# Ghost in the Machine - Next.js App

A machine health interface for **Tenstorrent's Tensix cores telemetry data** built with Next.js, React, and Tailwind CSS.

## Features

- 🎮 Retro Tamagotchi-style UI
- 👻 Ghost character with 5 health states
- 📊 Real-time telemetry visualization  
- 📁 JSON report file loading
- 📱 Mobile responsive design
- 🚂 Railway deployment ready

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Railway

1. Push this repo to GitHub
2. Connect to [Railway](https://railway.app)
3. Deploy from GitHub repo
4. Railway will auto-detect Next.js and deploy

Or use the Railway CLI:

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main page component
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── Ghost.tsx       # Ghost SVG character
│   ├── TenstorrentTamagotchi.tsx  # Device frame
│   └── Modals.tsx      # About & Lexicon modals
├── types/
│   └── index.ts        # TypeScript types
└── utils/
    └── health.ts       # Health computation logic
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Author

Made by [@mmazco](https://x.com/mmazco)
