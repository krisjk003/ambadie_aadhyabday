"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGlobal } from "@/context/GlobalContext";

interface PhotoCardProps {
  realSrc: string;
  cartoonSrc: string;
  isDraggable?: boolean;
  className?: string;
  label?: string;
  objectFit?: "cover" | "contain";
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function PhotoCard({ realSrc, cartoonSrc, isDraggable = false, className = "", label, objectFit = "cover" }: PhotoCardProps) {
  const { setCursorState } = useGlobal();
  const [isCartoon, setIsCartoon] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation States
  const [blurAmount, setBlurAmount] = useState(0);
  const [showSweep, setShowSweep] = useState(false);
  const [showParticles, setShowParticles] = useState<"none" | "gather" | "disperse">("none");
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Physics - Reduced for elegance
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);
  
  // Light reflection gradient
  const reflectionX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const reflectionY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursorState(isDraggable ? "drag" : "view");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setCursorState("default");
  };

  const toggleTransformation = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 1. Subtle focus blur
    setBlurAmount(8);
    await sleep(300);

    // 2. Light sweep travels across & tiny particles gather
    setShowSweep(true);
    setShowParticles("gather");
    await sleep(400);

    // 3. Image dissolves / emerges
    setIsCartoon(!isCartoon);
    await sleep(600); // Wait for crossfade

    // 4. Particles disperse & image sharpens
    setShowSweep(false);
    setShowParticles("disperse");
    setBlurAmount(0);
    
    await sleep(500); // Disperse time
    setShowParticles("none");
    setIsTransitioning(false);
  };

  // Generate deterministic but random-looking particles for the effect
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radiusOuter = 100 + Math.random() * 50;
    const radiusInner = 20 + Math.random() * 20;
    return {
      id: i,
      xGather: Math.cos(angle) * radiusInner,
      yGather: Math.sin(angle) * radiusInner,
      xOuter: Math.cos(angle) * radiusOuter,
      yOuter: Math.sin(angle) * radiusOuter,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 0.2
    };
  });

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl cursor-pointer group ${className}`}
      style={{ perspective: 1500 }}
      drag={isDraggable}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
      dragElastic={0.1}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleTransformation}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered && !isDraggable ? 1.02 : 1,
          y: isHovered && !isDraggable ? -5 : 0
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* The Base Images Container */}
        <motion.div 
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl bg-[#03010A] border border-white/10"
          animate={{ filter: `blur(${blurAmount}px)` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Real Image */}
          <Image src={realSrc} alt="Real" fill className={`object-${objectFit}`} priority />

          {/* Cartoon Image (Cinematic Overlay) */}
          <AnimatePresence>
            {isCartoon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 z-10 bg-[#03010A]"
              >
                <Image src={cartoonSrc} alt="Cartoon" fill className={`object-${objectFit}`} priority />
                {/* Subtle cinematic color grade overlay for cartoon */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-teal-500/10 mix-blend-screen pointer-events-none"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover Light Reflection */}
          <motion.div 
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${reflectionX} ${reflectionY}, rgba(255,255,255,0.3) 0%, transparent 50%)`
            }}
          />

          {/* Cinematic Light Sweep Effect during transition */}
          <AnimatePresence>
            {showSweep && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay z-30 pointer-events-none skew-x-12"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Localized Particle Burst System */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          <AnimatePresence>
            {showParticles !== "none" && particles.map(p => {
              const isGathering = showParticles === "gather";
              return (
                <motion.div
                  key={p.id}
                  initial={{ 
                    opacity: 0, 
                    x: isGathering ? p.xOuter : p.xGather, 
                    y: isGathering ? p.yOuter : p.yGather,
                    scale: 0
                  }}
                  animate={{ 
                    opacity: isGathering ? [0, 1, 0.8] : [0.8, 1, 0], 
                    x: isGathering ? p.xGather : p.xOuter, 
                    y: isGathering ? p.yGather : p.yOuter,
                    scale: isGathering ? 1 : 0
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: isGathering ? 0.6 : 0.8, 
                    delay: p.delay,
                    ease: isGathering ? "circOut" : "circIn"
                  }}
                  className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  style={{ width: p.size, height: p.size }}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dynamic Atmospheric Hover Glow */}
        <motion.div 
          className="absolute inset-0 -z-10 rounded-xl blur-2xl pointer-events-none transition-colors duration-700 opacity-0 group-hover:opacity-100"
          style={{
            background: isCartoon ? 'rgba(34, 211, 238, 0.15)' : 'rgba(244, 201, 93, 0.15)'
          }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        />

        {/* Interaction Hint */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 font-mono text-[9px] tracking-[0.3em] uppercase text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isCartoon ? 'bg-[var(--color-accent-teal)] shadow-[0_0_5px_var(--color-accent-teal)]' : 'bg-[var(--color-accent-gold)] shadow-[0_0_5px_var(--color-accent-gold)]'}`}></div>
            <span className="opacity-80">[ {isTransitioning ? "DECRYPTING" : (isCartoon ? "VIEW REAL" : "VIEW LORE")} ]</span>
          </div>
        </div>

        {/* Label Tag */}
        {label && (
          <motion.div
            className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold px-4 py-2 uppercase tracking-widest z-40 shadow-lg"
            style={{ transform: "translateZ(30px)" }}
            animate={{ opacity: isCartoon && !isTransitioning ? 1 : 0, y: isCartoon && !isTransitioning ? 0 : 10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            LORE UNLOCKED: {label}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
