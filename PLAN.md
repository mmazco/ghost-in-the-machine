# Ghost in the Machine - Development Plan

## Project Overview

A Tamagotchi-style "Ghost in the Machine" dashboard for Tenstorrent hardware that translates raw telemetry data into an animated ghost character.

---

## Phase 1: UI Simulation ✅ COMPLETE

Built interactive UI with sliders/controls to verify all ghost states, belly scaling, and core grid animations work correctly with mock data.

### Completed Features
- [x] Ghost SVG with 5 health states (healthy, tired, sick, critical, dead)
- [x] Visual indicators (sweat drops, blush, sparkles, red tint)
- [x] Belly scaling based on L1 usage
- [x] 12×12 Core Activity Grid (2D Torus Network)
- [x] Cyan-highlighted active cores per operation
- [x] Operation timeline playback (8 ops @ 500ms each)
- [x] Toggle switch: Ghost view vs Grid-only view
- [x] Simulation controls (temp, power, L1, utilization sliders)
- [x] Auto/Manual health mode toggle
- [x] Stats bar (SRAM %, TEMP °C, POWER W)
- [x] About modal with project description
- [x] Lexicon modal with glossary
- [x] Sound effects (beeps on state changes)
- [x] Health state thresholds explanation section
- [x] Core activity grid explanation with mini examples

---

## Phase 2: Real Data Integration 🚧 IN PROGRESS

Add JSON file loading from ttnn-visualizer format to replace mock controls with real telemetry data.

### Branch
`feature/telemetry-data` - https://github.com/mmazco/ghost-in-the-machine/commits/feature/telemetry-data

### Integration Options

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A) Parse real ttnn-visualizer reports** | Use actual SQLite + CSV from ttnn-visualizer | Authentic data | Complex (multi-file parsing), may lack temp/power |
| **B) Simplified JSON format** | Custom JSON schema for Ghost demo | Easy to implement, all needed fields | Not directly ttnn-visualizer compatible |
| **C) Hybrid (Recommended)** | Simplified JSON + future converter script | Best of both | Requires Python script for real data |

### Data Mapping: UI Elements → JSON Fields

| UI Element | Data Needed | JSON Field | Notes |
|------------|-------------|------------|-------|
| **Ghost Health State** | temp, l1Usage, utilization | `device_info.temp`, `l1_usage`, `perf_summary.avg_utilization` | Computed via threshold logic |
| **Belly Scale** | L1 SRAM % | `l1_usage.used_bytes / total_bytes` | Scale 1.0x → 1.3x |
| **Sweat Drops** | Temperature > 65°C | `device_info.temp` | Animated SVG drops |
| **Red Tint** | Temperature > 70°C | `device_info.temp` | Filter on ghost |
| **Sparkles** | Computing (op running) | `op_timeline` (when playing) | Golden animated sparkles |
| **Core Grid** | Which cores are active | `op_timeline[].cores` | Array of [row, col] pairs |
| **Stats Bar** | SRAM %, TEMP, POWER | `l1_usage`, `device_info.temp`, `device_info.power` | Top stats display |
| **Current OP** | Operation name | `op_timeline[].name` | e.g., "matmul", "attention" |
| **Op Counter** | X/Y ops, cores active | `op_timeline.length`, `op_timeline[].cores.length` | "3/8 · 5 cores active" |

### Proposed JSON Schema

```json
{
  "device_info": {
    "temp": 52,
    "power": 85,
    "chip": "Wormhole"
  },
  "l1_usage": {
    "used_bytes": 786432,
    "total_bytes": 1048576
  },
  "op_timeline": [
    { "op_id": 1, "name": "embedding", "cores": [[0,0], [0,1], [1,0], [1,1], [2,0], [2,1]], "duration_us": 120 },
    { "op_id": 2, "name": "matmul", "cores": [[0,0], [1,1], [2,2], [3,3], [4,4]], "duration_us": 200 },
    { "op_id": 3, "name": "layernorm", "cores": [[5,5], [5,6], [6,5], [6,6]], "duration_us": 80 },
    { "op_id": 4, "name": "attention", "cores": [[0,0], [2,2], [4,4], [6,6], [8,8], [10,10]], "duration_us": 250 },
    { "op_id": 5, "name": "softmax", "cores": [[3,3], [4,3], [5,3], [4,4], [5,4]], "duration_us": 60 },
    { "op_id": 6, "name": "dropout", "cores": [[7,7], [8,7], [7,8]], "duration_us": 40 },
    { "op_id": 7, "name": "linear", "cores": [[9,9], [10,9], [9,10], [10,10]], "duration_us": 150 },
    { "op_id": 8, "name": "gelu", "cores": [[11,0], [11,1], [11,2]], "duration_us": 70 }
  ],
  "perf_summary": {
    "total_ops": 8,
    "avg_utilization": 0.78
  }
}
```

### Health State Threshold Logic

```javascript
const computeHealth = (temp, l1Percent, utilization) => {
  if (temp > 75 && l1Percent > 90) return 'dead';
  if (temp > 70 || l1Percent > 85) return 'critical';
  if (temp > 65 || l1Percent > 75) return 'sick';
  if (utilization < 0.5) return 'tired';
  return 'healthy';
};
```

### Phase 2 Tasks

- [x] Create `sample-report.json` with realistic data
- [x] Add drag-drop JSON file loader component
- [x] Add "Load Report" button as alternative to drag-drop (click to browse)
- [x] Parse JSON and populate React state
- [x] Add "Data Source" toggle: Simulation vs Loaded Data
- [x] Keep simulation controls available for demo purposes
- [ ] Test with various JSON configurations
- [ ] (Future) Python script to convert ttnn-visualizer reports → Ghost JSON

### UI Impact

**None** - The UI remains unchanged. We're only adding a new data source that populates the same state variables the simulation sliders currently control.

---

## References

- [ttnn-visualizer](https://github.com/tenstorrent/ttnn-visualizer) - Tenstorrent's model visualization tool
- [tt-smi](https://docs.tenstorrent.com/tools/index.html) - System Management Interface for telemetry
- [TT-NN](https://docs.tenstorrent.com/tt-metal/latest/ttnn/index.html) - Tenstorrent Neural Network library

---

## Author

Made by [@mmazco](https://x.com/mmazco)
