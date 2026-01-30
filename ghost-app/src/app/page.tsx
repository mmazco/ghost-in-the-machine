'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import TenstorrentTamagotchi from '@/components/TenstorrentTamagotchi';
import { About, Lexicon } from '@/components/Modals';
import CoreActivityGrid from '@/components/CoreActivityGrid';
import { computeHealth, mockOpTimeline } from '@/utils/health';
import { TelemetryReport, HealthState } from '@/types';

export default function Home() {
  // Simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [temp, setTemp] = useState(52);
  const [power, setPower] = useState(85);
  const [l1Usage, setL1Usage] = useState(50);
  const [utilization, setUtilization] = useState(0.78);
  const [opIndex, setOpIndex] = useState(0);
  const [autoHealth, setAutoHealth] = useState(true);
  const [manualHealth, setManualHealth] = useState<HealthState>('healthy');
  const [showGhost, setShowGhost] = useState(true);
  
  // Modal state
  const [lexiconOpen, setLexiconOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // Data loading state
  const [dataSource, setDataSource] = useState<'simulation' | 'loaded'>('simulation');
  const [loadedReport, setLoadedReport] = useState<TelemetryReport | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File loading handlers
  const handleFileLoad = useCallback((file: File) => {
    setLoadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as TelemetryReport;
        if (!json.device_info || !json.l1_usage || !json.op_timeline) {
          throw new Error('Missing required fields: device_info, l1_usage, or op_timeline');
        }
        setLoadedReport(json);
        setDataSource('loaded');
        setOpIndex(0);
        setIsPlaying(false);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to parse JSON');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      handleFileLoad(file);
    } else {
      setLoadError('Please drop a .json file');
    }
  }, [handleFileLoad]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileLoad(file);
  }, [handleFileLoad]);

  // Active data based on source
  const activeOpTimeline = dataSource === 'loaded' && loadedReport 
    ? loadedReport.op_timeline 
    : mockOpTimeline;
  
  const activeTemp = dataSource === 'loaded' && loadedReport 
    ? loadedReport.device_info.temp 
    : temp;
  
  const activePower = dataSource === 'loaded' && loadedReport 
    ? loadedReport.device_info.power 
    : power;
  
  const activeL1Usage = dataSource === 'loaded' && loadedReport 
    ? Math.round((loadedReport.l1_usage.used_bytes / loadedReport.l1_usage.total_bytes) * 100)
    : l1Usage;
  
  const activeUtilization = dataSource === 'loaded' && loadedReport 
    ? loadedReport.perf_summary?.avg_utilization || 0.78
    : utilization;

  const computedHealth = useMemo(() => 
    computeHealth(activeTemp, activeL1Usage, activeUtilization),
    [activeTemp, activeL1Usage, activeUtilization]
  );

  const health = autoHealth ? computedHealth : manualHealth;
  const currentOp = activeOpTimeline[opIndex] || activeOpTimeline[0];

  // Timeline playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setOpIndex(prev => (prev + 1) % activeOpTimeline.length);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, activeOpTimeline.length]);

  // Reset function
  const handleRestart = () => {
    setTemp(52);
    setPower(85);
    setL1Usage(50);
    setUtilization(0.78);
    setOpIndex(0);
    setIsPlaying(false);
    setAutoHealth(true);
    setDataSource('simulation');
    setLoadedReport(null);
    setLoadError(null);
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-6 sm:py-12 px-4 relative">
      {/* Header Buttons */}
      <button
        onClick={() => setAboutOpen(true)}
        className="fixed top-4 left-4 px-3 sm:px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs sm:text-sm font-mono hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm z-40"
      >
        About
      </button>
      <button
        onClick={() => setLexiconOpen(true)}
        className="fixed top-4 right-4 px-3 sm:px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs sm:text-sm font-mono hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm z-40"
      >
        Lexicon
      </button>

      {/* Modals */}
      <About isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <Lexicon isOpen={lexiconOpen} onClose={() => setLexiconOpen(false)} />

      {/* Stats Display */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-6 text-xs sm:text-sm font-mono mt-8 sm:mt-0">
        <div className="text-neutral-500">
          SRAM: <span className={activeL1Usage > 75 ? 'text-orange-500' : 'text-neutral-900'}>{activeL1Usage}%</span>
        </div>
        <div className="text-neutral-500">
          TEMP: <span className={activeTemp > 65 ? 'text-red-500' : 'text-neutral-900'}>{activeTemp}°C</span>
        </div>
        <div className="text-neutral-500">
          POWER: <span className="text-neutral-900">{activePower}W</span>
        </div>
        {dataSource === 'loaded' && (
          <div className="text-green-600 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            LIVE DATA
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 mb-4 sm:mb-6">
        <button
          onClick={handleRestart}
          className="px-4 sm:px-6 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors text-sm"
        >
          Restart
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 sm:px-6 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Tamagotchi Device */}
      <TenstorrentTamagotchi
        temp={activeTemp}
        power={activePower}
        l1Usage={activeL1Usage}
        computing={isPlaying}
        health={health}
        opTimeline={activeOpTimeline}
        opIndex={opIndex}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        showGhost={showGhost}
        onToggleGhost={() => setShowGhost(!showGhost)}
      />

      {/* Current Operation Display */}
      <div className="mt-4 text-center">
        <div className="text-xs text-neutral-400 mb-1 flex items-center justify-center gap-1.5">
          CURRENT OP
          <div className="group relative">
            <div className="w-4 h-4 rounded-full bg-neutral-300 text-neutral-600 text-[10px] font-bold flex items-center justify-center cursor-help hover:bg-neutral-400 transition-colors">i</div>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-56 text-left z-50">
              Shows which AI operation is running. Press Play to cycle through operations. Watch the grid light up as each operation uses different Tensix cores.
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
            </div>
          </div>
        </div>
        <div className="font-mono text-lg text-green-500">{currentOp.name}</div>
        <div className="text-xs text-neutral-500 mt-1">
          {opIndex + 1}/{activeOpTimeline.length} · {currentOp.cores.length} cores active
        </div>
      </div>

      {/* Data Source Section */}
      <div className="mt-6 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 w-full max-w-md">
        <div className="text-xs font-medium text-neutral-400 mb-4 text-center">DATA SOURCE</div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setDataSource('simulation')}
            className={`px-4 py-2 text-xs rounded-full transition-colors ${
              dataSource === 'simulation' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-300 text-neutral-600'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => loadedReport && setDataSource('loaded')}
            disabled={!loadedReport}
            className={`px-4 py-2 text-xs rounded-full transition-colors ${
              dataSource === 'loaded' ? 'bg-green-600 text-white' : 
              loadedReport ? 'bg-white border border-neutral-300 text-neutral-600 hover:border-green-400' :
              'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Loaded Data {loadedReport && '✓'}
          </button>
        </div>

        {/* File Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-green-500 bg-green-50' 
              : loadedReport 
                ? 'border-green-300 bg-green-50' 
                : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
          />
          {loadedReport ? (
            <div>
              <div className="text-green-600 font-medium text-sm mb-1">
                ✓ {loadedReport.report_name || 'Report Loaded'}
              </div>
              <div className="text-xs text-neutral-500">
                {loadedReport.device_info?.chip || 'Unknown chip'} · {loadedReport.op_timeline?.length || 0} ops
              </div>
              <div className="text-xs text-neutral-400 mt-2">
                Drop another file to replace
              </div>
            </div>
          ) : (
            <div>
              <div className="text-neutral-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-sm text-neutral-600 font-medium">
                Drop JSON report here
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                or click to browse
              </div>
            </div>
          )}
        </div>

        {loadError && (
          <div className="mt-3 text-xs text-red-500 text-center">
            Error: {loadError}
          </div>
        )}

        {loadedReport && dataSource === 'loaded' && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <div className="text-xs text-neutral-500 mb-2 text-center">Loaded Report Values</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-neutral-400">TEMP</div>
                <div className="font-mono text-neutral-700">{loadedReport.device_info.temp}°C</div>
              </div>
              <div>
                <div className="text-neutral-400">POWER</div>
                <div className="font-mono text-neutral-700">{loadedReport.device_info.power}W</div>
              </div>
              <div>
                <div className="text-neutral-400">L1</div>
                <div className="font-mono text-neutral-700">{activeL1Usage}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health Mode Selector */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-sm text-neutral-500">Health Mode:</span>
          <button
            onClick={() => setAutoHealth(true)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              autoHealth ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-300 text-neutral-600'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setAutoHealth(false)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              !autoHealth ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-300 text-neutral-600'
            }`}
          >
            Manual
          </button>
        </div>
        
        {!autoHealth && (
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            {(['healthy', 'tired', 'sick', 'critical', 'dead'] as HealthState[]).map((state) => (
              <button
                key={state}
                onClick={() => setManualHealth(state)}
                className={`px-3 py-2 rounded-lg text-xs transition-all ${
                  manualHealth === state
                    ? 'bg-neutral-900 text-white shadow-lg scale-105'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
        )}

        {autoHealth && (
          <div className="text-center text-xs text-neutral-400">
            Health: <span className={`font-bold ${
              health === 'healthy' ? 'text-green-500' :
              health === 'tired' ? 'text-yellow-500' :
              health === 'sick' ? 'text-orange-500' :
              health === 'critical' ? 'text-red-500' :
              'text-neutral-500'
            }`}>{health.toUpperCase()}</span>
            <span className="ml-2 text-neutral-300">(computed from data)</span>
          </div>
        )}
      </div>

      {/* Simulation Controls */}
      {dataSource === 'simulation' && (
        <div className="mt-6 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 w-full max-w-md">
          <div className="text-xs font-medium text-neutral-400 mb-4 text-center">SIMULATION CONTROLS</div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Temperature</span>
                <span className={`font-mono ${temp > 65 ? 'text-red-500' : 'text-neutral-700'}`}>{temp}°C</span>
              </div>
              <input
                type="range" min="30" max="90" value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>30°C</span>
                <span className="text-orange-400">65°C sick</span>
                <span className="text-red-400">70°C critical</span>
                <span>90°C</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Power</span>
                <span className="font-mono text-neutral-700">{power}W</span>
              </div>
              <input
                type="range" min="10" max="200" value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">L1 SRAM Usage</span>
                <span className={`font-mono ${l1Usage > 85 ? 'text-red-500' : l1Usage > 75 ? 'text-orange-500' : 'text-neutral-700'}`}>{l1Usage}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={l1Usage}
                onChange={(e) => setL1Usage(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0%</span>
                <span className="text-orange-400">75% sick</span>
                <span className="text-red-400">85% critical</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Utilization</span>
                <span className={`font-mono ${utilization < 0.5 ? 'text-yellow-500' : 'text-neutral-700'}`}>{(utilization * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={utilization * 100}
                onChange={(e) => setUtilization(Number(e.target.value) / 100)}
                className="w-full accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0%</span>
                <span className="text-yellow-400">&lt;50% = tired</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health State Thresholds */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 max-w-md w-full">
        <div className="text-xs font-medium text-neutral-400 mb-4 text-center">HEALTH STATE THRESHOLDS</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Healthy: temp&lt;65 &amp; l1&lt;75</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Tired: util &lt; 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>Sick: temp&gt;65 | l1&gt;75</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Critical: temp&gt;70 | l1&gt;85</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2 justify-center">
            <span className="w-3 h-3 rounded-full bg-neutral-500"></span>
            <span>Dead: temp&gt;75 AND l1&gt;90</span>
          </div>
        </div>
      </div>

      {/* Core Activity Grid Explanation */}
      <CoreActivityGrid />

      {/* Footer */}
      <div className="mt-8 text-xs text-neutral-400 text-center">
        Made by <a href="https://x.com/mmazco" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">@mmazco</a>
      </div>
    </main>
  );
}
