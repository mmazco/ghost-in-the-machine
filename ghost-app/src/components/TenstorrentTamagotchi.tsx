'use client';

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

export default function TenstorrentTamagotchi({
  temp, power, l1Usage, computing, health, opTimeline, opIndex, onTogglePlay, showGhost, onToggleGhost
}: TenstorrentTamagotchiProps) {
  const currentOp = opTimeline[opIndex] || opTimeline[0];
  const active = computing;

  const ghostPattern = [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,0,0,1,1,0,0,1,1,1],
    [1,1,1,0,0,1,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,0,0,1,1,0,1,1],
    [1,0,0,0,1,0,0,1,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const isCoreActive = (row: number, col: number) => {
    return currentOp?.cores?.some(([r, c]) => r === row && c === col) || false;
  };

  const GridDot = ({ active: isActive, isCore }: { active: boolean; isCore: boolean }) => (
    <motion.div
      className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm ${
        isCore ? 'bg-cyan-400' : isActive ? 'bg-neutral-300' : 'bg-neutral-800'
      }`}
      animate={isCore ? { scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] } : {}}
      transition={isCore ? { duration: 0.5, repeat: Infinity } : {}}
      style={{
        boxShadow: isCore
          ? '0 0 12px rgba(34,211,238,0.9), 0 0 4px rgba(34,211,238,1)'
          : isActive
          ? '0 0 4px rgba(200,200,200,0.5)'
          : 'none'
      }}
    />
  );

  const SpeakerGrille = () => (
    <div className="flex gap-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-1 h-6 bg-neutral-300 rounded-full" />
      ))}
    </div>
  );

  const ToggleSwitch = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors ${on ? 'bg-neutral-700' : 'bg-neutral-300'}`}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: on ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  const DialButton = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-neutral-200 border-4 border-neutral-300 flex items-center justify-center hover:bg-neutral-300 transition-colors active:scale-95"
    >
      {icon}
    </button>
  );

  return (
    <div className="relative">
      {/* Device Frame */}
      <div className="bg-neutral-100 rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-neutral-200">
        {/* Screen */}
        <div className="bg-neutral-900 rounded-2xl p-3 sm:p-4 relative overflow-hidden">
          {/* Grid */}
          <div className="grid grid-cols-12 gap-0.5 sm:gap-1">
            {[...Array(144)].map((_, idx) => {
              const row = Math.floor(idx / 12);
              const col = idx % 12;
              const isCore = computing && isCoreActive(row, col);
              const showPixelPattern = !showGhost && active && ghostPattern[row]?.[col] === 1;
              return (
                <GridDot key={idx} active={showPixelPattern} isCore={isCore} />
              );
            })}
          </div>
          
          {/* Ghost Overlay */}
          {showGhost && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Ghost health={health} temp={temp} power={power} computing={computing} l1Usage={l1Usage} />
            </div>
          )}
        </div>
        
        {/* Control Area */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-2 mt-2">
          <ToggleSwitch on={showGhost} onToggle={onToggleGhost} />
          <SpeakerGrille />
          <DialButton
            onClick={onTogglePlay}
            icon={computing ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          />
        </div>
      </div>
    </div>
  );
}
