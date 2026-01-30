# Ghost in the Machine 👻

A Tamagotchi-style dashboard for **Tenstorrent Tensix cores telemetry**. Translates hardware metrics into an animated ghost character—humanizing silicon.

## Features

- **5 Health States**: Healthy → Tired → Sick → Critical → Dead (based on temp, L1 usage, utilization)
- **12×12 Core Grid**: Visualizes active Tensix cores per operation
- **Toggle View**: Switch between Ghost SVG and pixelated grid
- **JSON Upload**: Load real telemetry reports or use simulation sliders
- **Animated Timeline**: Cycles through ops (embedding, matmul, attention, etc.)

## Quick Start

```bash
cd ghost-app
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Railway

```bash
cd ghost-app
railway up
```

## Health Thresholds

| State | Condition |
|-------|-----------|
| Dead | temp > 75°C AND L1 > 90% |
| Critical | temp > 70°C OR L1 > 85% |
| Sick | temp > 65°C OR L1 > 75% |
| Tired | utilization < 50% |
| Healthy | default |

## JSON Schema

```json
{
  "device_info": { "chip": "Wormhole", "temp": 58, "power": 95 },
  "l1_usage": { "used_bytes": 838860, "total_bytes": 1048576 },
  "op_timeline": [
    { "op_id": 1, "name": "matmul", "cores": [[0,0], [1,1]] }
  ],
  "perf_summary": { "avg_utilization": 0.82 }
}
```

## Tech Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion

## License

MIT
