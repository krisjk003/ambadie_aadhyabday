"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayData } from "@/data/birthday";
import { PhotoCard } from "@/components/PhotoCard";

const GatheringParticles = ({ color }: { color: string }) => {
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 100 + Math.random() * 100;
    return {
      id: i,
      xStart: Math.cos(angle) * radius,
      yStart: Math.sin(angle) * radius,
      delay: Math.random() * 0.4,
      duration: 0.8 + Math.random(),
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: p.xStart, y: p.yStart, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: 0, y: 0, scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeInOut" }}
          className="absolute w-1 h-1 rounded-full shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: color, color: color }}
        />
      ))}
    </div>
  );
};

export function MemoryDeckSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const memories = birthdayData.memories;
  const isEnd = currentIndex >= memories.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const next = () => {
    if (currentIndex < memories.length) setCurrentIndex(prev => prev + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section id="memory-deck" className="min-h-screen py-32 flex flex-col items-center justify-center relative bg-transparent overflow-hidden">
      
      {/* Background glow for the deck area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[var(--color-accent-teal)]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="z-10 container mx-auto px-4 max-w-7xl flex flex-col items-center h-full relative">
        
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center mb-16 pointer-events-none"
        >
          <h2 className="font-display text-5xl md:text-8xl font-bold tracking-tighter mb-4 uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">THE MEMORY DECK</h2>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[var(--color-accent-cyan)]">PHYSICAL EVIDENCE. DRAG TO REVEAL.</p>
        </motion.div>

        <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-[4/5] perspective-[2000px] mt-12 md:mt-24">
          {/* Incoming Particle Reveal */}
          <AnimatePresence mode="wait">
            {!isEnd && (
              <GatheringParticles key={`gather-${currentIndex}`} color="var(--color-accent-teal)" />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isEnd ? (
              memories.map((mem, index) => {
                const isActive = index === currentIndex;
                const isPassed = index < currentIndex;
                
                if (isPassed) return null;

                const zIndex = memories.length - index;
                const offset = (index - currentIndex) * 35;
                const scale = 1 - (index - currentIndex) * 0.08;
                const rotateZ = (index - currentIndex) * 3;

                return (
                  <motion.div
                    key={mem.id}
                    layout
                    initial={{ opacity: 0, y: 150, filter: "blur(20px)", scale: 0.8 }}
                    animate={{ 
                      opacity: isActive ? 1 : Math.max(0, 0.5 - (index - currentIndex) * 0.2), 
                      y: offset, 
                      z: -offset * 12,
                      scale: scale,
                      rotateZ: isActive ? 0 : rotateZ,
                      rotateX: 0,
                      filter: isActive ? "blur(0px)" : `blur(${(index - currentIndex) * 5}px)`
                    }}
                    exit={{ opacity: 0, x: -800, rotateZ: -20, rotateY: -30, filter: "blur(20px)", scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1.2 }}
                    className="absolute inset-0"
                    style={{ zIndex }}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(e, { offset, velocity }) => {
                      setIsDragging(false);
                      if (offset.x < -100 || velocity.x < -500) next();
                      else if (offset.x > 100 || velocity.x > 500) next();
                    }}
                  >
                    <div className="w-full h-full relative group">
                      
                      {/* Drag trail glow and particles */}
                      <AnimatePresence>
                        {isActive && isDragging && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1.1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute -inset-4 bg-[var(--color-accent-teal)]/30 blur-2xl -z-10 rounded-[2rem] pointer-events-none mix-blend-screen"
                          />
                        )}
                      </AnimatePresence>

                      <PhotoCard 
                        realSrc={mem.original}
                        cartoonSrc={mem.cartoon}
                        className="w-full h-full shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                        isDraggable={isActive}
                        objectFit={mem.objectFit as "cover" | "contain" | undefined}
                      />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} 
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20, filter: isActive ? "blur(0px)" : "blur(10px)" }} 
                        transition={{ delay: isActive ? 0.8 : 0, duration: 1 }}
                        className="absolute -bottom-24 left-0 right-0 text-center pointer-events-none"
                      >
                        <p className="font-mono text-[10px] text-[var(--color-accent-teal)] uppercase tracking-[0.4em] mb-2 drop-shadow-[0_0_10px_rgba(63,224,197,0.5)]">{mem.category}</p>
                        <h3 className="font-display text-3xl md:text-5xl text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{mem.title}</h3>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border border-[var(--color-accent-teal)]/20 rounded-[2rem] glass-hologram shadow-[0_0_80px_rgba(34,211,238,0.1)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-teal)]/5 to-transparent pointer-events-none"></div>
                <h3 className="font-display text-4xl text-white mb-6 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10">THAT'S THE LORE FOR NOW.</h3>
                <p className="font-mono text-[10px] text-[var(--color-accent-cyan)] tracking-[0.4em] uppercase mb-12 relative z-10">MORE MEMORIES COMING...</p>
                <button 
                  onClick={() => setCurrentIndex(0)}
                  className="group relative px-10 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-500 overflow-hidden relative z-10"
                >
                  <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-3">
                    REPLAY THE LORE
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <AnimatePresence>
          {!isEnd && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-40 md:mt-48 flex items-center gap-8"
            >
              <button onClick={prev} className={`p-4 rounded-full border transition-all duration-300 ${currentIndex > 0 ? 'border-white/30 text-white hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'border-white/5 text-white/10 pointer-events-none'}`}>&larr;</button>
              <span className="font-mono text-[10px] text-white/50 tracking-[0.4em]">{currentIndex + 1} / {memories.length}</span>
              <button onClick={next} className="p-4 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">&rarr;</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
