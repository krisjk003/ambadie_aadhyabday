"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayData } from "@/data/birthday";

export function PhotoRoulette() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string>("");

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    
    let counter = 0;
    const interval = setInterval(() => {
      const randomMem = birthdayData.memories[Math.floor(Math.random() * birthdayData.memories.length)];
      setCurrentImage(randomMem.original);
      counter++;
      
      if (counter > 20) {
        clearInterval(interval);
        setSpinning(false);
        setResult(randomMem);
      }
    }, 100); // rapidly cycle images
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-auto">
      <button 
        onClick={spin}
        className="font-mono text-[10px] tracking-widest uppercase border border-white/20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
      >
        RANDOM MEMORY
      </button>

      <AnimatePresence>
        {(spinning || result) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="w-48 h-64 rounded-2xl overflow-hidden border border-white/20 relative shadow-2xl bg-black"
          >
            {/* Flashing images */}
            {currentImage && (
              <img src={currentImage} className="absolute inset-0 w-full h-full object-cover" alt="Random" />
            )}
            
            {/* Result Overlay */}
            {result && !spinning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col items-center justify-end p-4 text-center"
              >
                <p className="font-mono text-[8px] text-[var(--color-accent-teal)] mb-1 uppercase drop-shadow-md">YOU GOT:</p>
                <h4 className="font-display text-lg text-white font-bold leading-none mb-2 uppercase drop-shadow-lg">{result.title}</h4>
                <p className="font-mono text-[8px] text-white/90 leading-tight uppercase mb-4 drop-shadow-md">{result.caption}</p>
                
                <button 
                  onClick={() => {
                    setResult(null);
                    setCurrentImage("");
                  }}
                  className="font-mono text-[9px] text-white/70 hover:text-white border border-white/30 rounded-full px-4 py-1.5 transition-colors bg-black/50"
                >
                  CLOSE
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
