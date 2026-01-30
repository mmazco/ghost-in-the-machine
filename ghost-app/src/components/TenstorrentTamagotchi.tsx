'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import Ghost from './Ghost';
import { HealthState, Operation } from '@/types';

interface TenstorrentTamagotchiProps {
  temp: number;
  power: number;
  l1Usage: number;
  computing: boolean;
  health: HealthState;
  opTimeline: Operation[];
  opIndex: number;
  onTogglePlay: () => void;
  showGhost: boolean;
  onToggleGhost: () => void;
}

// Ghost patterns for pixelated view based on health state
const ghostPatterns: Record<HealthState, number[][]> = {
  healthy: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0,0,1,1,0],
    [0,1,1,0,0,1,1,0,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  tired: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,1,1,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,0,0,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  sick: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,0,1,0,1,1,0,1,0,1,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,1,0,0,1,1,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  critical: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,0,1,1,0,1,1,1,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,0,0,1,1,1,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
  dead: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,0,1,1,0,1,1,1,0],
    [0,1,1,1,0,1,1,0,1,1,1,0],
    [0,1,1,0,1,1,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,0,0,1,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,1,0],
    [0,0,0,0,1,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ],
};

export default function TenstorrentTamagotchi({
  temp, power, l1Usage, computing, health, opTimeline, opIndex, onTogglePlay, showGhost, onToggleGhost
}: TenstorrentTamagotchiProps) {
  const currentOp = opTimeline[opIndex] || opTimeline[0];
  const activeCores = currentOp?.cores || [];
  const gridPattern = ghostPatterns[health] || ghostPatterns.healthy;

  const isCoreActive = useCallback((row: number, col: number) => {
    return activeCores.some(([r, c]) => r === row && c === col);
  }, [activeCores]);

  const GridDot = ({ active, isCore }: { active: boolean; isCore: boolean }) => (
    <motion.div
      className={`w-[16px] h-[16px] sm:w-[17px] sm:h-[17px] rounded-sm ${
        isCore ? 'bg-cyan-400' : active ? 'bg-neutral-300' : 'bg-neutral-800'
      }`}
      animate={isCore ? { scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] } : {}}
      transition={isCore ? { duration: 0.4, repeat: Infinity } : {}}
      style={{
        boxShadow: isCore
          ? '0 0 12px rgba(34,211,238,0.9), 0 0 4px rgba(34,211,238,1)'
          : active
          ? '0 0 4px rgba(200,200,200,0.5)'
          : 'none'
      }}
    />
  );

  const SpeakerGrille = () => (
    <div className="flex flex-wrap gap-1 w-16 justify-center">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
      ))}
    </div>
  );

  // Vertical toggle switch like the original
  const ToggleSwitch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div
      className="relative w-8 h-14 bg-neutral-300 rounded-full cursor-pointer shadow-inner"
      onClick={onToggle}
    >
      <motion.div
        className="absolute left-1 w-6 h-6 bg-neutral-700 rounded-full shadow-md"
        animate={{ top: on ? 6 : 30 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );

  const DialButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
    <motion.button
      className="w-14 h-14 rounded-full bg-gradient-to-b from-neutral-200 to-neutral-300 shadow-lg flex items-center justify-center border-4 border-neutral-300"
      style={{
        boxShadow: '0 4px 0 #a3a3a3, 0 6px 8px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.5)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, y: 2 }}
      onClick={onClick}
    >
      {icon}
    </motion.button>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Tamagotchi Device */}
      <div
        className="relative rounded-3xl p-3"
        style={{
          background: 'linear-gradient(180deg, #f5f5f5 0%, #e5e5e5 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.05)',
          border: '1px solid #d4d4d4',
        }}
      >
        {/* Screen Area */}
        <div
          className="rounded-2xl p-3 mb-4"
          style={{
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {/* LCD Screen */}
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              background: '#111',
              width: '228px',
              height: '228px',
            }}
          >
            {/* Grid with core activity overlay */}
            <div className="absolute inset-0 p-3 grid grid-cols-12 gap-0.5">
              {gridPattern.flat().map((pixelActive, idx) => {
                const row = Math.floor(idx / 12);
                const col = idx % 12;
                const isCore = computing && isCoreActive(row, col);
                // When showGhost is true (SVG mode), don't show pixel pattern - only show active cores
                // When showGhost is false (grid mode), show the pixel ghost pattern
                const showPixelPattern = !showGhost && pixelActive === 1;
                return (
                  <GridDot key={idx} active={showPixelPattern} isCore={isCore} />
                );
              })}
            </div>

            {/* Ghost SVG overlay - only show when showGhost is true */}
            {showGhost && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Ghost health={health} temp={temp} power={power} computing={computing} l1Usage={l1Usage} />
              </div>
            )}
          </div>
        </div>
        
        {/* Control Area */}
        <div className="flex items-center justify-between px-4 py-2">
          <ToggleSwitch on={showGhost} onToggle={onToggleGhost} />
          <SpeakerGrille />
          <DialButton
            onClick={onTogglePlay}
            icon={computing ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          />
        </div>
      </div>
    </div>
  );
}
