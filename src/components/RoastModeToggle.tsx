"use client";

import { motion } from "framer-motion";
import { useGlobal } from "@/context/GlobalContext";

export function RoastModeToggle() {
  const { roastMode, toggleRoastMode } = useGlobal();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4"
    >
      <button
        onClick={toggleRoastMode}
        className={`fixed bottom-12 left-6 z-50 font-mono text-[9px] uppercase tracking-[0.3em] px-4 py-2 transition-all flex items-center gap-2 ${
          roastMode ? 'text-[var(--color-accent-magenta)] drop-shadow-[0_0_10px_rgba(192,91,244,0.5)]' : 'text-white/50 hover:text-white'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${roastMode ? 'bg-[var(--color-accent-magenta)] animate-pulse' : 'bg-white/30'}`}></span>
        [ {roastMode ? "DISABLE ROAST" : "ROAST"} ]
      </button>

      {/* Global Glitch Overlay */}
      {roastMode && (
        <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-exclusion overflow-hidden">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjZjAwIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>
          <motion.div 
            animate={{ 
              y: ["0%", "100%", "-100%"],
              opacity: [0, 0.5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-[var(--color-accent-coral)] opacity-50"
          ></motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center p-4">
             <div className="font-mono text-[10px] text-[var(--color-accent-coral)] uppercase tracking-widest text-center animate-text-glitch mix-blend-difference z-50">
                <p>SYSTEM WARNING: AURA LEVELS CRITICALLY LOW.</p>
                <p>BOTH SUBJECTS DISPLAYING PROBLEMATIC TENDENCIES.</p>
                <p>RECOMMEND TOUCHING GRASS.</p>
             </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
