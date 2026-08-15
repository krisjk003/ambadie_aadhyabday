"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayData } from "@/data/birthday";
import { useGlobal } from "@/context/GlobalContext";

import { TrolleyEmergencyGame } from "@/components/TrolleyEmergencyGame";

export function SecretRevealSection() {
  const [unlocked, setUnlocked] = useState(false);
  const { setCursorState, forceUnlockSecret } = useGlobal();

  useEffect(() => {
    if (forceUnlockSecret && !unlocked) {
      triggerUnlock();
    }
  }, [forceUnlockSecret, unlocked]);

  const triggerUnlock = () => {
    if (unlocked) return;
    setUnlocked(true);
    setCursorState("default");
  };

  return (
    <section id="secret-reveal" className="py-40 min-h-[120vh] bg-[#05050A] flex flex-col items-center justify-center relative border-t border-white/5 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: unlocked ? '#000000' : '#05050A' }}>
      
      {/* Background Atmosphere */}
      <motion.div 
        animate={{ opacity: unlocked ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-[#05050A] to-[#05050A] pointer-events-none"
      />
      <motion.div 
        animate={{ opacity: unlocked ? 1 : 0 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black pointer-events-none"
      />

      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10 flex flex-col items-center">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 w-full"
        >
          <h2 className={`font-display text-4xl md:text-7xl font-bold tracking-tighter mb-4 uppercase transition-colors duration-1000 ${unlocked ? 'text-white' : 'text-red-500 glow-red'}`}>
            {unlocked ? "CLASSIFIED MEMORY UNLOCKED." : "YOU PROBABLY SHOULDN'T SEE THIS."}
          </h2>
          <p className="font-mono text-[10px] md:text-xs text-neutral-500 tracking-[0.4em] uppercase transition-colors duration-1000">
            {unlocked ? "AURA -500. CANON EVENT SECURED." : "SECURITY CLEARANCE REQUIRED."}
          </p>
        </motion.div>

        {/* Image / Game Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            boxShadow: unlocked ? "0 0 80px rgba(255,255,255,0.1)" : "0 0 0px rgba(0,0,0,0)",
            borderColor: unlocked ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.2)',
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-3xl mx-auto flex flex-col min-h-[700px] rounded-[2rem] overflow-hidden border bg-black/50 backdrop-blur-md select-none touch-none shadow-[0_0_50px_rgba(255,0,0,0.1)] shadow-red-900/20"
          onMouseEnter={() => setCursorState(unlocked ? "default" : "hidden")}
          onMouseLeave={() => setCursorState("default")}
        >
          
          <div className="relative z-20 flex flex-col flex-1 w-full">
            {unlocked ? (
              <motion.div 
                initial={{ filter: "blur(20px)", scale: 1.1 }}
                animate={{ filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-12"
              >
                <img 
                  src="/images/trolley.jpg" 
                  alt="Trolley" 
                  className="w-full max-w-xl h-auto rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10"
                  draggable={false}
                />
              </motion.div>
            ) : (
              <TrolleyEmergencyGame onSuccess={triggerUnlock} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
