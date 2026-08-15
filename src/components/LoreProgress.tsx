"use client";

import { useGlobal } from "@/context/GlobalContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoreProgress() {
  const { loreFragments } = useGlobal();
  const [justFound, setJustFound] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (loreFragments.length > 0) {
      setJustFound(true);
      const timer = setTimeout(() => setJustFound(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loreFragments.length]);

  return (
    <>
      <div className="fixed top-8 left-8 z-50 flex flex-col gap-2 pointer-events-none">
        <div className="font-mono text-[9px] tracking-[0.4em] uppercase bg-white/5 backdrop-blur-md px-5 py-3 border border-white/10 rounded-full text-white/50">
          CLASSIFIED ARCHIVE: <span className="text-[var(--color-accent-teal)]">{loreFragments.length}</span> / 5 UNLOCKED
        </div>
      </div>

      <AnimatePresence>
        {justFound && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-mono text-[10px] uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-[var(--color-accent-teal)]/30">
              CLASSIFIED ARCHIVE {loreFragments.length} UNLOCKED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loreFragments.length >= 5 && !closed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[99] pointer-events-none flex items-center justify-center bg-[#03010A]/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="text-center pointer-events-auto glass-hologram p-12 md:p-20 rounded-[2rem] border border-[var(--color-accent-teal)]/30 max-w-2xl relative overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-teal)]/10 to-transparent pointer-events-none"></div>
              
              <h2 className="font-display text-4xl md:text-6xl text-white font-bold mb-6 tracking-widest relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">LORE COMPLETE</h2>
              <p className="font-mono text-[10px] text-[var(--color-accent-cyan)] leading-relaxed uppercase tracking-[0.4em] mb-12 relative z-10">
                ALL 5 ARCHIVES RECOVERED. THE FULL PICTURE IS NOW VISIBLE.
              </p>
              
              <button 
                onClick={() => setClosed(true)}
                className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase border border-white/20 rounded-full px-8 py-3 text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
