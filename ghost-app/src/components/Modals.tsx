'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { glossaryData } from '@/utils/health';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function About({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ghost in the Machine</h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4 text-sm text-neutral-600">
              <p>
                A machine health interface for <strong>Tenstorrent&apos;s Tensix cores telemetry data</strong> to show 
                performance of the hardware. Translating raw tt-smi telemetry (
                <a href="https://github.com/tenstorrent/ttnn-visualizer" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-500 hover:underline">ttnn-visualizer</a>
                ) into a visual language for a wider audience to understand how hardware works, 
                effectively &apos;humanizing&apos; the silicon.
              </p>
              <p>
                The prototype is a React component styled like a retro 8-bit Tamagotchi in a minimal 
                web-based system health dashboard. Instead of showing standard hardware graphs, it uses 
                a &apos;ghost&apos; character (the silicon soul) whose mood and animations are directly mapped 
                to real-time Tenstorrent telemetry data.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-400">
              <span>Made by </span>
              <a href="https://x.com/mmazco" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-500 hover:underline">@mmazco</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Lexicon({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Lexicon</h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-neutral-500 mb-3">THE &quot;SILICON SOUL&quot; (HARDWARE)</h3>
                <div className="space-y-3">
                  {glossaryData.hardware.map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-neutral-800">{item.term}:</span>
                      <span className="text-neutral-600 ml-2">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              <section>
                <h3 className="text-sm font-bold text-neutral-500 mb-3">THE &quot;MOOD ENGINE&quot; (TELEMETRY)</h3>
                <div className="space-y-3">
                  {glossaryData.telemetry.map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-neutral-800">{item.term}:</span>
                      <span className="text-neutral-600 ml-2">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              <section>
                <h3 className="text-sm font-bold text-neutral-500 mb-3">DEVELOPER TOOLING</h3>
                <div className="space-y-3">
                  {glossaryData.developer.map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-semibold text-neutral-800">{item.term}:</span>
                      <span className="text-neutral-600 ml-2">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
