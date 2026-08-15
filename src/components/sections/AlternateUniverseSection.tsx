"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function AlternateUniverseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.55], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="h-[200vh] relative bg-black">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Phase 1 */}
          <motion.div style={{ opacity: text1Opacity }} className="text-center px-4 absolute w-full">
            <h3 className="font-display text-5xl md:text-8xl font-bold tracking-tighter mb-6 uppercase text-white">what if i never meet you</h3>
            <p className="font-mono text-neutral-600 uppercase tracking-[0.4em] text-[10px] md:text-xs">TIMELINE B / NO SHARED MEMORIES FOUND</p>
          </motion.div>

          {/* Phase 2 */}
          <motion.div style={{ opacity: text2Opacity }} className="text-center px-4 absolute space-y-6 w-full">
            <p className="font-display text-3xl md:text-6xl font-bold tracking-tighter uppercase text-neutral-500">no gosspis</p>
            <p className="font-display text-3xl md:text-6xl font-bold tracking-tighter uppercase text-neutral-600">no vallikal</p>
            <p className="font-display text-3xl md:text-6xl font-bold tracking-tighter uppercase text-neutral-700">no pro phtographer</p>
            <p className="font-display text-3xl md:text-6xl font-bold tracking-tighter uppercase text-neutral-800">nothing</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
