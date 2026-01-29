import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ghost SVG Component with health states
const Ghost = ({ health, temp, power, computing }) => {
  const isOverheating = temp > 65;
  const pulseDuration = Math.max(0.3, 2 - (power / 150));

  // Health-based appearance
  const getGhostStyle = () => {
    if (health === 'dead') return { fill: '#666', opacity: 0.5 };
    if (health === 'critical') return { fill: '#fff', opacity: 0.9 };
    if (health === 'sick') return { fill: '#fff', opacity: 0.95 };
    if (health === 'tired') return { fill: '#fff', opacity: 1 };
    return { fill: '#fff', opacity: 1 }; // healthy
  };

  const style = getGhostStyle();

  // Sweat drops for overheating
  const SweatDrops = () => (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={28 + i * 20}
          y={15}
          width="4"
          height="6"
          rx="2"
          fill="#888"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], y: [0, 8, 12, 18] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </g>
  );

  // X eyes for dead state
  const DeadEyes = () => (
    <g stroke="#333" strokeWidth="3" strokeLinecap="round">
      <line x1="30" y1="28" x2="38" y2="38" />
      <line x1="38" y1="28" x2="30" y2="38" />
      <line x1="54" y1="28" x2="62" y2="38" />
      <line x1="62" y1="28" x2="54" y2="38" />
    </g>
  );

  // Dizzy spiral eyes for sick/critical
  const DizzyEyes = ({ speed = 2 }) => (
    <g>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '34px 33px' }}
      >
        <circle cx="34" cy="33" r="6" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '58px 33px' }}
      >
        <circle cx="58" cy="33" r="6" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
      </motion.g>
    </g>
  );

  // Tired droopy eyes
  const TiredEyes = () => (
    <g>
      <rect x="28" y="32" width="12" height="6" rx="1" fill="#333" />
      <rect x="52" y="32" width="12" height="6" rx="1" fill="#333" />
      {/* Droopy eyelids */}
      <rect x="28" y="28" width="12" height="4" rx="1" fill="#ddd" />
      <rect x="52" y="28" width="12" height="4" rx="1" fill="#ddd" />
    </g>
  );

  // Normal/computing eyes
  const NormalEyes = ({ red = false }) => (
    <g>
      <motion.rect
        x="28"
        y="28"
        width="12"
        height="14"
        rx="2"
        fill={red ? '#ff4444' : '#333'}
        animate={red ? { fill: ['#ff4444', '#ff6666', '#ff4444'] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.rect
        x="52"
        y="28"
        width="12"
        height="14"
        rx="2"
        fill={red ? '#ff4444' : '#333'}
        animate={red ? { fill: ['#ff4444', '#ff6666', '#ff4444'] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      {/* Highlights */}
      <rect x="31" y="31" width="4" height="4" rx="1" fill="#fff" opacity={red ? 0.3 : 0.7} />
      <rect x="55" y="31" width="4" height="4" rx="1" fill="#fff" opacity={red ? 0.3 : 0.7} />
    </g>
  );

  // Mouth variations
  const getMouth = () => {
    if (health === 'dead') {
      return <line x1="38" y1="52" x2="54" y2="52" stroke="#333" strokeWidth="3" strokeLinecap="round" />;
    }
    if (health === 'critical') {
      return (
        <motion.path
          d="M 38 55 Q 46 48, 54 55"
          stroke="#333"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{ d: ['M 38 55 Q 46 48, 54 55', 'M 38 53 Q 46 46, 54 53', 'M 38 55 Q 46 48, 54 55'] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      );
    }
    if (health === 'sick') {
      return <path d="M 38 52 Q 46 58, 54 52" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" style={{ opacity: 0.7 }} />;
    }
    if (health === 'tired') {
      return <path d="M 40 52 L 52 52" stroke="#333" strokeWidth="3" strokeLinecap="round" />;
    }
    // Healthy/computing - happy
    return (
      <motion.path
        d="M 38 50 Q 46 58, 54 50"
        stroke="#333"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        animate={computing ? { d: ['M 38 50 Q 46 58, 54 50', 'M 40 52 Q 46 56, 52 52', 'M 38 50 Q 46 58, 54 50'] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
    );
  };

  // Get eyes based on state
  const getEyes = () => {
    if (health === 'dead') return <DeadEyes />;
    if (health === 'critical') return <DizzyEyes speed={1} />;
    if (health === 'sick') return <DizzyEyes speed={3} />;
    if (health === 'tired') return <TiredEyes />;
    return <NormalEyes red={isOverheating} />;
  };

  return (
    <motion.svg
      width="92"
      height="100"
      viewBox="0 0 92 100"
      animate={computing && health === 'healthy' ? { x: [-1, 1, -1, 1, 0] } : health === 'dead' ? {} : { y: [-1, 1, -1] }}
      transition={computing ? { duration: 0.1, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ghost body with pulse */}
      <motion.g
        animate={health !== 'dead' ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '46px 50px' }}
      >
        {/* Main body */}
        <motion.path
          d={`
            M 16 40
            Q 16 10, 46 10
            Q 76 10, 76 40
            L 76 70
            L 68 65
            L 60 72
            L 52 65
            L 46 72
            L 40 65
            L 32 72
            L 24 65
            L 16 70
            Z
          `}
          fill={style.fill}
          stroke="#222"
          strokeWidth="3"
          opacity={style.opacity}
        />

        {/* Body highlight */}
        <ellipse cx="32" cy="35" rx="8" ry="12" fill="#fff" opacity="0.3" />
      </motion.g>

      {/* Eyes */}
      {getEyes()}

      {/* Mouth */}
      {getMouth()}

      {/* Sweat drops when overheating */}
      {isOverheating && health !== 'dead' && <SweatDrops />}

      {/* Blush marks for healthy state */}
      {health === 'healthy' && !isOverheating && (
        <g opacity="0.3">
          <ellipse cx="24" cy="45" rx="6" ry="3" fill="#ffaaaa" />
          <ellipse cx="68" cy="45" rx="6" ry="3" fill="#ffaaaa" />
        </g>
      )}

      {/* Computing sparkles */}
      {computing && health === 'healthy' && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <motion.rect
              key={i}
              x={10 + i * 22}
              y={5}
              width="4"
              height="4"
              fill="#333"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [5, -5, 5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </g>
      )}

      {/* Sick/critical warning indicator */}
      {(health === 'sick' || health === 'critical') && (
        <motion.text
          x="46"
          y="90"
          textAnchor="middle"
          fontSize="16"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {health === 'critical' ? '⚠' : '💤'}
        </motion.text>
      )}
    </motion.svg>
  );
};

// Grid Dot Component
const GridDot = ({ active }) => (
  <div
    className={`w-4 h-4 rounded-sm transition-all duration-200 ${
      active ? 'bg-white' : 'bg-neutral-800'
    }`}
    style={{
      boxShadow: active ? '0 0 4px rgba(255,255,255,0.5)' : 'none'
    }}
  />
);

// Spark animation
const Spark = ({ from, to }) => (
  <motion.div
    className="absolute w-2 h-2 bg-white rounded-sm"
    style={{ left: from.x, top: from.y }}
    initial={{ opacity: 1 }}
    animate={{
      left: to.x,
      top: to.y,
      opacity: [1, 1, 0]
    }}
    transition={{ duration: 0.3, ease: 'linear' }}
  />
);

// Speaker Grille Component
const SpeakerGrille = () => (
  <div className="flex flex-wrap gap-1 w-16 justify-center">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
    ))}
  </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ on, onToggle }) => (
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

// Dial Button Component
const DialButton = ({ icon, onClick }) => (
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

// Ghost patterns for the grid display
const ghostPatterns = {
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

// Main Tamagotchi Component
export default function TenstorrentTamagotchi({
  temp = 45,
  power = 50,
  l1_usage = 30,
  computing = false,
  health = 'healthy',
  onToggleComputing,
  onRestart
}) {
  const [sparks, setSparks] = useState([]);
  const [sparkId, setSparkId] = useState(0);

  // Grid configuration (12x12 Torus)
  const gridSize = 12;

  const gridPattern = ghostPatterns[health] || ghostPatterns.healthy;

  // Random spark positions for computing state
  useEffect(() => {
    if (!computing || health === 'dead') {
      setSparks([]);
      return;
    }

    const interval = setInterval(() => {
      const cellSize = 18;
      const offset = 12;
      const fromRow = Math.floor(Math.random() * gridSize);
      const fromCol = Math.floor(Math.random() * gridSize);
      const toRow = Math.floor(Math.random() * gridSize);
      const toCol = Math.floor(Math.random() * gridSize);

      const newSpark = {
        id: sparkId,
        from: { x: offset + fromCol * cellSize, y: offset + fromRow * cellSize },
        to: { x: offset + toCol * cellSize, y: offset + toRow * cellSize },
      };

      setSparks(prev => [...prev.slice(-8), newSpark]);
      setSparkId(prev => prev + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [computing, health, sparkId]);

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
            {/* Grid */}
            <div className="absolute inset-0 p-3 grid grid-cols-12 gap-0.5">
              {gridPattern.flat().map((active, idx) => (
                <GridDot key={idx} active={active} />
              ))}
            </div>

            {/* Sparks */}
            <AnimatePresence>
              {sparks.map(spark => (
                <Spark key={spark.id} from={spark.from} to={spark.to} />
              ))}
            </AnimatePresence>

            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
          </div>
        </div>

        {/* Control Area */}
        <div className="flex items-center justify-between px-4 py-2">
          {/* Toggle Switch */}
          <ToggleSwitch on={computing} onToggle={onToggleComputing} />

          {/* Speaker Grille */}
          <SpeakerGrille />

          {/* Dial Button */}
          <DialButton
            onClick={onToggleComputing}
            icon={
              computing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )
            }
          />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 flex gap-6 text-neutral-500">
        <button className="p-2 hover:text-neutral-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12h4m4 0h4m4 0h4" />
            <path d="M6 8v8" />
            <path d="M10 6v12" />
            <path d="M14 9v6" />
            <path d="M18 7v10" />
          </svg>
        </button>
        <button className="p-2 hover:text-neutral-700 transition-colors" onClick={onRestart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-9-9" />
            <path d="M21 3v6h-6" />
          </svg>
        </button>
        <button className="p-2 hover:text-neutral-700 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
            <path d="M15 9a4 4 0 010 6" />
            <path d="M18 6a8 8 0 010 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Export the Ghost component separately for use in previews
export { Ghost, ghostPatterns };
