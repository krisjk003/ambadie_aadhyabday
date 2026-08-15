"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function KonamiEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setUnlocked(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTap = () => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setUnlocked(true);
        return 0;
      }
      return next;
    });
  };

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-24 h-24 z-[9999]" 
        onClick={handleTap}
        style={{ opacity: 0 }}
      ></div>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="font-display text-4xl md:text-8xl text-red-500 font-bold mb-6 uppercase drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] leading-none">
                YOU WEREN'T SUPPOSED<br/>TO FIND THIS.
              </h2>
              <p className="font-mono text-[10px] md:text-xs text-neutral-400 tracking-[0.4em] uppercase mb-16 animate-pulse">
                SYSTEM BREACH DETECTED. LORE COMPROMISED.
              </p>
              <button 
                onClick={() => { setUnlocked(false); setTapCount(0); }}
                className="font-mono text-[10px] uppercase tracking-widest border border-red-500/50 text-red-500 px-8 py-3 rounded-full hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all"
              >
                CLOSE TERMINAL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
