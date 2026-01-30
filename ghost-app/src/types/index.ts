export type HealthState = 'healthy' | 'tired' | 'sick' | 'critical' | 'dead';

export interface Operation {
  op_id: number;
  name: string;
  cores: number[][];
  duration_us?: number;
}

export interface DeviceInfo {
  chip: string;
  temp: number;
  power: number;
}

export interface L1Usage {
  used_bytes: number;
  total_bytes: number;
}

export interface PerfSummary {
  total_ops: number;
  avg_utilization: number;
  total_duration_us?: number;
}

export interface TelemetryReport {
  report_name?: string;
  timestamp?: string;
  device_info: DeviceInfo;
  l1_usage: L1Usage;
  op_timeline: Operation[];
  perf_summary?: PerfSummary;
}
