# Ghost in the Machine 👻

A machine health interface for **Tenstorrent's Tensix cores telemetry data** to show performance of the hardware. Translating raw tt-smi telemetry ([ttnn-visualizer](https://github.com/tenstorrent/ttnn-visualizer)) into a visual language for a wider audience to understand how hardware works, effectively 'humanizing' the silicon.

![Ghost in the Machine Demo](https://img.shields.io/badge/Status-Prototype-green)

## Overview

The prototype is a React component styled like a retro 8-bit Tamagotchi in a minimal web-based system health dashboard. Instead of showing standard hardware graphs, it uses a **'ghost' character** (the silicon soul) whose mood and animations are directly mapped to real-time Tenstorrent telemetry data.

## Features

### Health States
The ghost's appearance changes based on hardware metrics:
- **Healthy** - Normal operation, happy ghost with pink blush
- **Tired** - Low utilization (<50%), droopy eyes
- **Sick** - High temp (>65°C) or L1 usage (>75%), spiral eyes
- **Critical** - Dangerous levels (temp >70°C or L1 >85%), warning indicator
- **Dead** - System failure (temp >75°C AND L1 >90%), X eyes

### Visual Indicators
- **Red eyes** - Temperature > 65°C
- **Sweat drops** - Overheating
- **Pink blush** - Healthy and cool
- **Golden sparkles** - Actively computing
- **Belly expansion** - High L1 SRAM usage

### Core Activity Grid
- 12×12 grid representing the Tensix core array (2D Torus Network)
- Cyan-highlighted dots show active cores for current operation
- Toggle between ghost view and grid-only view
- Animated operation timeline: embedding → matmul → layernorm → attention → softmax → ffn → residual → output

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/mmazco/ghost-in-the-machine.git
cd ghost-in-the-machine
```

2. Start a local server:
```bash
python3 -m http.server 8080
```

3. Open in browser:
```
http://localhost:8080/TenstorrentTamagotchi.html
```

## Files

- `TenstorrentTamagotchi.html` - Main standalone demo (React + Tailwind + Framer Motion via CDN)
- `TenstorrentTamagotchi.jsx` - React component source
- `GhostStatesStatic.html` - Static reference for ghost states

## Tech Stack

- React 18
- Tailwind CSS
- Framer Motion
- Vanilla JavaScript/HTML

## Controls

- **Play/Pause** - Animate through operation timeline
- **Toggle Switch** - Switch between Ghost view and Grid-only view
- **Sliders** - Simulate temperature, power, L1 usage, and utilization
- **Health Mode** - Auto (computed from metrics) or Manual selection

## Inspired By

- [Focus Music Maker](https://focus-music-maker.vercel.app/) - Minimal Apple-style UI
- [ttnn-visualizer](https://github.com/tenstorrent/ttnn-visualizer) - Tenstorrent's model visualization tool

## Author

Made by [@mmazco](https://x.com/mmazco)

## License

MIT
