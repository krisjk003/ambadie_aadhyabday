"use client";

import { motion } from "framer-motion";
import { useGlobal } from "@/context/GlobalContext";

interface BirthdayPopupProps {
  onEnter: () => void;
}

export function BirthdayPopup({ onEnter }: BirthdayPopupProps) {
  const { setCursorState } = useGlobal();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="glass-hologram p-10 md:p-16 rounded-3xl max-w-2xl w-full text-center relative overflow-hidden border border-[var(--color-accent-violet)]/30 shadow-[0_0_80px_rgba(75,29,130,0.4)]"
      >
        {/* Inner ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-magenta)]/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-[var(--color-accent-cyan)] mb-8"
          >
            AUGUST 18, 2026
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.5 }}
            className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-4"
          >
            THE DAY HAS ARRIVED.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 2 }}
            className="flex items-center justify-center gap-4 text-[var(--color-accent-gold)] mt-8 mb-12"
          >
            <span className="font-display text-xl uppercase tracking-widest">AMBADI</span>
            <span className="text-sm">×</span>
            <span className="font-display text-xl uppercase tracking-widest">AADHYA</span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1 }}
            onMouseEnter={() => setCursorState("view")}
            onMouseLeave={() => setCursorState("default")}
            onClick={onEnter}
            className="group relative px-10 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-3">
              ENTER THE DAY
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </span>
          </motion.button>
        </div>
        
        {/* Subtle decorative particles inside the popup */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-accent-teal)]/10 blur-3xl rounded-full pointer-events-none"
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-accent-magenta)]/10 blur-3xl rounded-full pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}
