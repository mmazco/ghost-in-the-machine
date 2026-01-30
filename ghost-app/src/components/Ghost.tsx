'use client';

import { motion } from 'framer-motion';
import { HealthState } from '@/types';

interface GhostProps {
  health: HealthState;
  temp: number;
  power: number;
  computing: boolean;
  l1Usage?: number;
}

export default function Ghost({ health, temp, power, computing, l1Usage = 50 }: GhostProps) {
  const isOverheating = temp > 65;
  const pulseDuration = Math.max(0.3, 2 - (power / 150));
  const bellyExpand = (l1Usage / 100) * 8;

  const getGhostStyle = () => {
    if (health === 'dead') return { fill: '#fff', opacity: 0.7 };
    if (health === 'critical') return { fill: '#fff', opacity: 0.9 };
    if (health === 'sick') return { fill: '#fff', opacity: 0.95 };
    return { fill: '#fff', opacity: 1 };
  };

  const style = getGhostStyle();

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

  const DeadEyes = () => (
    <g stroke="#333" strokeWidth="3" strokeLinecap="round">
      <line x1="30" y1="28" x2="38" y2="38" />
      <line x1="38" y1="28" x2="30" y2="38" />
      <line x1="54" y1="28" x2="62" y2="38" />
      <line x1="62" y1="28" x2="54" y2="38" />
    </g>
  );

  const DizzyEyes = ({ speed = 2 }: { speed?: number }) => (
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

  const TiredEyes = () => (
    <g>
      <rect x="28" y="32" width="12" height="6" rx="1" fill="#333" />
      <rect x="52" y="32" width="12" height="6" rx="1" fill="#333" />
      <rect x="28" y="28" width="12" height="4" rx="1" fill="#ddd" />
      <rect x="52" y="28" width="12" height="4" rx="1" fill="#ddd" />
    </g>
  );

  const NormalEyes = ({ red = false }: { red?: boolean }) => (
    <g>
      <motion.rect
        x="28" y="28" width="12" height="14" rx="2"
        fill={red ? '#ff4444' : '#333'}
        animate={red ? { fill: ['#ff4444', '#ff6666', '#ff4444'] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.rect
        x="52" y="28" width="12" height="14" rx="2"
        fill={red ? '#ff4444' : '#333'}
        animate={red ? { fill: ['#ff4444', '#ff6666', '#ff4444'] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <rect x="31" y="31" width="4" height="4" rx="1" fill="#fff" opacity={red ? 0.3 : 0.7} />
      <rect x="55" y="31" width="4" height="4" rx="1" fill="#fff" opacity={red ? 0.3 : 0.7} />
    </g>
  );

  const Blush = () => (
    <g>
      <ellipse cx="22" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity="0.6" />
      <ellipse cx="70" cy="42" rx="6" ry="4" fill="#ffb6c1" opacity="0.6" />
    </g>
  );

  const Sparkles = () => (
    <g>
      {[
        { x: 12, y: 20, delay: 0 },
        { x: 78, y: 25, delay: 0.3 },
        { x: 8, y: 55, delay: 0.6 },
        { x: 82, y: 50, delay: 0.9 },
        { x: 46, y: 5, delay: 0.15 },
      ].map((spark, i) => (
        <motion.g key={i}>
          <motion.path
            d={`M ${spark.x} ${spark.y - 4} L ${spark.x} ${spark.y + 4} M ${spark.x - 4} ${spark.y} L ${spark.x + 4} ${spark.y}`}
            stroke="#ffd700"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.5], rotate: [0, 45, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: spark.delay, ease: "easeInOut" }}
            style={{ transformOrigin: `${spark.x}px ${spark.y}px` }}
          />
        </motion.g>
      ))}
    </g>
  );

  const getMouth = () => {
    if (health === 'dead') {
      return <line x1="38" y1="52" x2="54" y2="52" stroke="#333" strokeWidth="3" strokeLinecap="round" />;
    }
    if (health === 'critical') {
      return (
        <motion.path
          d="M 38 55 Q 46 48, 54 55"
          stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round"
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
    return (
      <motion.path
        d="M 38 50 Q 46 58, 54 50"
        stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round"
        animate={computing ? { d: ['M 38 50 Q 46 58, 54 50', 'M 40 52 Q 46 56, 52 52', 'M 38 50 Q 46 58, 54 50'] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
    );
  };

  const getEyes = () => {
    if (health === 'dead') return <DeadEyes />;
    if (health === 'critical') return <DizzyEyes speed={1} />;
    if (health === 'sick') return <DizzyEyes speed={3} />;
    if (health === 'tired') return <TiredEyes />;
    return <NormalEyes red={isOverheating} />;
  };

  return (
    <motion.svg
      width="92" height="100" viewBox="0 0 92 100"
      animate={computing && health === 'healthy' ? { x: [-1, 1, -1, 1, 0] } : health === 'dead' ? {} : { y: [-1, 1, -1] }}
      transition={computing ? { duration: 0.1, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.g
        animate={health !== 'dead' ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '46px 50px' }}
      >
        <motion.path
          d={`
            M ${16 - bellyExpand} 40
            Q ${16 - bellyExpand} 10, 46 10
            Q ${76 + bellyExpand} 10, ${76 + bellyExpand} 40
            L ${76 + bellyExpand} 70
            L ${68 + bellyExpand * 0.5} 65
            L ${60 + bellyExpand * 0.3} 72
            L 52 65
            L 46 72
            L 40 65
            L ${32 - bellyExpand * 0.3} 72
            L ${24 - bellyExpand * 0.5} 65
            L ${16 - bellyExpand} 70
            Z
          `}
          fill={style.fill}
          opacity={style.opacity}
          filter={isOverheating && health !== 'dead' ? 'url(#redTint)' : undefined}
        />
        <defs>
          <filter id="redTint">
            <feColorMatrix type="matrix" values="1.2 0 0 0 0.1  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </motion.g>

      {getEyes()}
      {getMouth()}
      {isOverheating && health !== 'dead' && <SweatDrops />}
      {health === 'healthy' && !isOverheating && <Blush />}
      {computing && (health === 'healthy' || health === 'tired') && <Sparkles />}
      
      {health === 'critical' && (
        <motion.text
          x="46" y="8" textAnchor="middle" fill="#ff4444" fontSize="14" fontWeight="bold"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          ⚠
        </motion.text>
      )}
      
      {health === 'tired' && !computing && (
        <motion.text
          x="70" y="15" fontSize="12"
          animate={{ opacity: [0, 1, 1, 0], y: [15, 10, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💤
        </motion.text>
      )}
    </motion.svg>
  );
}
