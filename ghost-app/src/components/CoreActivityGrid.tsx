'use client';

const exampleOps = [
  { name: 'embedding', cores: [[0,0], [0,1], [1,0], [1,1], [0,2], [1,2]], desc: 'Top-left cluster' },
  { name: 'matmul', cores: [[2,2], [3,3], [4,4], [5,5]], desc: 'Diagonal pattern' },
  { name: 'attention', cores: [[3,5], [4,6], [5,7], [6,8], [7,9]], desc: 'Diagonal spread' },
];

export default function CoreActivityGrid() {
  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 max-w-2xl w-full">
      <div className="text-xs font-medium text-neutral-400 mb-4 text-center">
        CORE ACTIVITY GRID (2D TORUS NETWORK)
      </div>
      <p className="text-sm text-neutral-600 mb-6 text-center">
        Use the <strong>toggle switch</strong> on the device to switch between Ghost view and Grid-only view.
        The grid represents the 12×12 Tensix core array. <span className="text-cyan-500 font-bold">Cyan dots</span> show active cores for the current operation.
      </p>
      
      {/* Example Core Patterns */}
      <div className="grid grid-cols-3 gap-4">
        {exampleOps.map((op) => (
          <div key={op.name} className="flex flex-col items-center">
            {/* Mini grid */}
            <div 
              className="rounded-lg p-1.5 mb-2"
              style={{ background: '#1a1a1a' }}
            >
              <div className="grid grid-cols-8 gap-px" style={{ width: '64px', height: '64px' }}>
                {[...Array(64)].map((_, idx) => {
                  const row = Math.floor(idx / 8);
                  const col = idx % 8;
                  const isActive = op.cores.some(([r, c]) => r === row && c === col);
                  return (
                    <div
                      key={idx}
                      className={`rounded-sm ${isActive ? 'bg-cyan-400' : 'bg-neutral-700'}`}
                      style={{
                        width: '6px',
                        height: '6px',
                        boxShadow: isActive ? '0 0 4px rgba(34,211,238,0.8)' : 'none'
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-sm font-mono text-neutral-700">{op.name}</div>
            <div className="text-xs text-neutral-400">{op.desc}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
        <div className="text-xs text-neutral-400">
          Each operation in the timeline activates specific cores. The pattern shows which Tensix cores are computing.
        </div>
      </div>
    </div>
  );
}
