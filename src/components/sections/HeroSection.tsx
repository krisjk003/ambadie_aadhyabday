"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayData } from "@/data/birthday";
import { useGlobal } from "@/context/GlobalContext";
import { BirthdayPopup } from "@/components/BirthdayPopup";
import { CosmicCelebration } from "@/components/CosmicCelebration";

export function HeroSection({ onEnter }: { onEnter: () => void }) {
  const { setCursorState } = useGlobal();
  const [phase, setPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState(0);
  
  // Ref to track if we've initialized the countdown
  const isInitialized = useRef(false);

  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      const target = new Date(birthdayData.targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        if (isInitialized.current && !isBirthday) {
          // Naturally hit zero during session
          triggerZeroEvent(true);
        } else if (!isInitialized.current) {
          // Page loaded after birthday already passed
          triggerZeroEvent(false);
        }
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
      isInitialized.current = true;
    };
    
    // Only check timer if not already in birthday mode
    if (!isBirthday) {
      checkDate();
      const interval = setInterval(checkDate, 1000);
      return () => clearInterval(interval);
    }
  }, [isBirthday]);

  // Initial load sequence (names etc)
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500), // small stars
      setTimeout(() => setPhase(2), 3500), // names slowly reveal
      setTimeout(() => setPhase(3), 5500), // secondary line
      setTimeout(() => setPhase(4), 7500), // countdown or direct to popup
    ];
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const triggerZeroEvent = (naturalTransition: boolean) => {
    setIsBirthday(true);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Freeze at zero

    if (naturalTransition) {
      // We watched it tick down to zero
      setCelebrationPhase(1); // Anticipation pause (00:00:00:00 shown)
      
      setTimeout(() => {
        setCelebrationPhase(2); // Massive Explosion
        
        // Play celebration audio hook
        const audio = new Audio('/media/audio/sfx-open.mp3'); // Reuse a sound or add a new one
        audio.volume = 0.6;
        audio.play().catch(() => {});
      }, 400);

      setTimeout(() => {
        setCelebrationPhase(3); // "BIRTHDAY PROTOCOL"
      }, 1500);

      setTimeout(() => {
        setCelebrationPhase(4); // "IS NOW ACTIVE."
      }, 3000);

      setTimeout(() => {
        setCelebrationPhase(5); // "THE CHAOS HAS OFFICIALLY BEGUN."
      }, 4500);

      setTimeout(() => {
        setShowPopup(true);
      }, 9000);
    } else {
      // Loaded directly into birthday mode
      setCelebrationPhase(5); // Show full celebration text immediately
      setTimeout(() => {
        if (phase >= 4) setShowPopup(true);
      }, 2000);
    }
  };

  // Check if we need to show popup for direct loads
  useEffect(() => {
    if (phase >= 4 && isBirthday && celebrationPhase === 5 && !showPopup) {
      const t = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, isBirthday, celebrationPhase, showPopup]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent text-white">
      
      {/* Permanent Cosmic Celebration Canvas (only mounts on birthday) */}
      {isBirthday && celebrationPhase >= 2 && (
        <CosmicCelebration playInitialBurst={celebrationPhase === 2} />
      )}

      {/* Screen Shake & Radial Light Burst exactly at T=0.4s */}
      <AnimatePresence>
        {celebrationPhase === 2 && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 bg-gradient-radial from-white via-white/50 to-transparent mix-blend-screen pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          x: celebrationPhase === 2 ? [0, -10, 10, -5, 5, 0] : 0,
          y: celebrationPhase === 2 ? [0, 10, -10, 5, -5, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
        className="z-30 text-center flex flex-col items-center max-w-4xl px-4 pointer-events-none relative w-full h-full justify-center"
      >
        <AnimatePresence mode="wait">
          {phase >= 2 && (
            <motion.div
              key="names"
              initial={{ opacity: 0, filter: "blur(20px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8"
            >
              <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase">
                {birthdayData.names.person1}
              </h1>
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="font-display text-3xl md:text-5xl text-[var(--color-accent-gold)]"
              >
                ×
              </motion.span>
              <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase">
                {birthdayData.names.person2}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="space-y-4 mb-16"
            >
              <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase text-neutral-400">SAME BIRTHDAY.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Permanent Countdown Container */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              className="w-full flex flex-col items-center justify-center relative"
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-3xl rounded-full mix-blend-screen transition-all duration-2000 ${isBirthday ? 'bg-[var(--color-accent-magenta)]/30' : 'bg-[var(--color-accent-violet)]/10'}`}></div>
                <div className="flex gap-4 md:gap-12 relative z-10">
                  <AnimatedNumber value={timeLeft.days} label="DAYS" isBirthday={isBirthday} />
                  <div className={`w-px h-16 bg-gradient-to-b from-transparent to-transparent mt-4 transition-colors duration-1000 ${isBirthday ? 'via-[var(--color-accent-cyan)]/50' : 'via-white/20'}`}></div>
                  <AnimatedNumber value={timeLeft.hours} label="HOURS" isBirthday={isBirthday} />
                  <div className={`w-px h-16 bg-gradient-to-b from-transparent to-transparent mt-4 transition-colors duration-1000 ${isBirthday ? 'via-[var(--color-accent-cyan)]/50' : 'via-white/20'}`}></div>
                  <AnimatedNumber value={timeLeft.minutes} label="MINUTES" isBirthday={isBirthday} />
                  <div className={`w-px h-16 bg-gradient-to-b from-transparent to-transparent mt-4 transition-colors duration-1000 ${isBirthday ? 'via-[var(--color-accent-cyan)]/50' : 'via-white/20'}`}></div>
                  <AnimatedNumber value={timeLeft.seconds} label="SECONDS" isBirthday={isBirthday} />
                </div>
              </div>

              {/* Countdown Complete Indicator */}
              <AnimatePresence>
                {isBirthday && celebrationPhase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute -top-12 text-[var(--color-accent-gold)] font-mono text-[9px] tracking-[0.5em] uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  >
                    COUNTDOWN COMPLETE
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cinematic Birthday Messaging */}
              <div className="absolute top-40 flex flex-col items-center justify-center w-full min-h-[100px]">
                <AnimatePresence>
                  {celebrationPhase >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-center absolute w-full"
                    >
                      <h3 className="font-display text-3xl md:text-5xl uppercase tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                        {celebrationPhase === 3 && "BIRTHDAY PROTOCOL"}
                        {celebrationPhase === 4 && "IS NOW ACTIVE."}
                        {celebrationPhase >= 5 && "THE CHAOS HAS OFFICIALLY BEGUN."}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-40 md:mt-48 flex justify-center w-full absolute pointer-events-auto"
                style={{ bottom: "-120px" }}
              >
                <button 
                  onClick={() => {
                    onEnter();
                    setTimeout(() => {
                      const deckElement = document.getElementById("memory-deck");
                      if (deckElement) {
                        deckElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 200);
                  }}
                  className="group relative px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 font-mono text-[9px] tracking-[0.4em] uppercase text-white/70 group-hover:text-white flex items-center gap-3">
                    [ ACCESS LORE EARLY ]
                  </span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showPopup && <BirthdayPopup onEnter={onEnter} />}
      </AnimatePresence>
    </div>
  );
}

function AnimatedNumber({ value, label, isBirthday }: { value: number, label: string, isBirthday: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center w-16 md:w-24">
      <div className="relative h-16 md:h-24 overflow-hidden w-full flex justify-center items-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute font-display text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-colors duration-1000 ${isBirthday ? 'text-white' : 'text-white'}`}
            style={{ 
              textShadow: isBirthday ? "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(217, 70, 239, 0.4)" : "0 0 15px rgba(255,255,255,0.3)",
              willChange: "transform, opacity"
            }}
          >
            {value.toString().padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={`font-mono text-[8px] md:text-[10px] tracking-[0.3em] mt-2 uppercase opacity-80 transition-colors duration-1000 ${isBirthday ? 'text-[var(--color-accent-gold)]' : 'text-[var(--color-accent-teal)]'}`}>
        {label}
      </div>
    </div>
  );
}
