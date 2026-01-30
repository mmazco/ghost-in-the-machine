import { HealthState } from '@/types';

export const computeHealth = (temp: number, l1Percent: number, avgUtilization: number): HealthState => {
  if (temp > 75 && l1Percent > 90) return 'dead';
  if (temp > 70 || l1Percent > 85) return 'critical';
  if (temp > 65 || l1Percent > 75) return 'sick';
  if (avgUtilization < 0.5) return 'tired';
  return 'healthy';
};

export const mockOpTimeline = [
  { op_id: 1, name: "embedding", cores: [[0,0], [0,1], [1,0], [1,1], [0,2], [1,2]] },
  { op_id: 2, name: "matmul", cores: [[2,2], [2,3], [3,2], [3,3], [4,4], [5,5], [4,5], [5,4]] },
  { op_id: 3, name: "layernorm", cores: [[6,6], [7,7], [8,8], [6,7], [7,8]] },
  { op_id: 4, name: "attention", cores: [[3,5], [4,6], [5,7], [6,8], [7,9], [8,10]] },
  { op_id: 5, name: "softmax", cores: [[9,9], [10,10], [11,11], [9,10], [10,11]] },
  { op_id: 6, name: "ffn", cores: [[0,5], [1,6], [2,7], [3,8], [4,9], [5,10], [6,11]] },
  { op_id: 7, name: "residual", cores: [[2,0], [3,1], [4,2], [5,3], [6,4], [7,5]] },
  { op_id: 8, name: "output", cores: [[8,6], [9,7], [10,8], [11,9], [10,9], [11,10]] },
];

export const glossaryData = {
  hardware: [
    { term: "Tensix Core", definition: "The fundamental building block of Tenstorrent's AI processors. Each core contains five RISC-V processors, a compute engine, and local memory." },
    { term: "RISC-V", definition: "The open-source instruction set architecture Tenstorrent uses. Inside each Tensix core, five small processors manage data movement and math operations." },
    { term: "L1 SRAM", definition: "High-speed local memory (~1MB) inside each Tensix core. Much faster than DRAM because data doesn't leave the chip." },
    { term: "2D Torus Network", definition: "The 'highway system' on the chip. Unlike a simple grid, a torus connects opposite edges, allowing data shortcuts across the chip." },
    { term: "Wormhole & Blackhole", definition: "Tenstorrent's chip generations. Wormhole is their current flagship, Blackhole is next-gen for massive AI clusters." },
  ],
  telemetry: [
    { term: "Telemetry", definition: "Real-time data about hardware health: temperature, power usage, and processor utilization." },
    { term: "tt-smi", definition: "System Management Interface - the command-line tool to check the hardware's pulse (power and temperature)." },
    { term: "TT-NN Visualizer", definition: "Diagnostic tool that creates reports on how AI models move through the chip - the 'script' for Ghost animations." },
    { term: "SRAM Utilization", definition: "How much fast L1 memory is currently full. High usage makes the Ghost look 'stuffed' or bloated." },
  ],
  developer: [
    { term: "TT-Metalium", definition: "The low-level SDK for developers writing custom code directly for the hardware (bare-metal)." },
    { term: "TT-NN", definition: "The high-level Python library that feels like PyTorch, making it easy to run models without hardware expertise." },
  ],
};
