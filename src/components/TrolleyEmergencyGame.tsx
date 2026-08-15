"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "@/context/GlobalContext";

// ============================================================================
// CONFIGURATION
// ============================================================================
const CORRECT_ANSWER = "YOUR_ANSWER_HERE";

interface TrolleyEmergencyGameProps {
  onSuccess: () => void;
}

type Phase = "question" | "transition" | "fire" | "success" | "failure";

export function TrolleyEmergencyGame({ onSuccess }: TrolleyEmergencyGameProps) {
  const { audioPlaying } = useGlobal();

  const [phase, setPhase] = useState<Phase>("question");
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [clicks, setClicks] = useState(0);
  const [shockwaves, setShockwaves] = useState<{id: number, x: number, y: number}[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shockwaveIdRef = useRef(0);

  // Sound effects
  const playSound = (type: "click" | "wrong" | "correct" | "fire" | "extinguish" | "fail" | "success") => {
    if (!audioPlaying) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "extinguish") {
        osc.type = "square";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "fail") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.start();
        osc.stop(ctx.currentTime + 1);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim().toLowerCase().replace(/\s+/g, "");
    const cleanAnswer = CORRECT_ANSWER.trim().toLowerCase().replace(/\s+/g, "");

    if (cleanInput === cleanAnswer || cleanInput === "kallavandhi") {
      setErrorMsg("");
      playSound("correct");
      setPhase("transition");
      setTimeout(() => {
        setPhase("fire");
        startTimer();
      }, 2000);
    } else {
      playSound("wrong");
      const messages = ["INCORRECT.", "YOU REALLY DON'T REMEMBER THIS?", "TRY AGAIN.", "NOT EVEN CLOSE."];
      setErrorMsg(messages[Math.floor(Math.random() * messages.length)]);
      setInputValue("");
    }
  };

  const startTimer = () => {
    setTimeLeft(30);
    setClicks(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("failure");
          playSound("fail");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleExtinguish = (e: React.MouseEvent) => {
    if (phase !== "fire") return;
    playSound("extinguish");
    
    // Add shockwave effect
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = shockwaveIdRef.current++;
    setShockwaves(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setShockwaves(prev => prev.filter(s => s.id !== id));
    }, 1000);

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= 7) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("success");
      playSound("success");
      setTimeout(() => {
        onSuccess();
      }, 4000);
    }
  };

  const handleRetry = () => {
    playSound("click");
    setPhase("fire");
    startTimer();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fireIntensity = Math.max(0, 1 - (clicks / 7));

  // Timer colors based on timeLeft
  let timerGlow = "drop-shadow-[0_0_15px_rgba(255,200,0,0.3)] text-amber-200";
  let timerScale = 1;
  let timerAnim = {};
  
  if (timeLeft <= 20 && timeLeft > 10) {
    timerGlow = "drop-shadow-[0_0_20px_rgba(255,100,0,0.6)] text-orange-400";
    timerAnim = { scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] };
  } else if (timeLeft <= 10) {
    timerGlow = "drop-shadow-[0_0_30px_rgba(255,0,0,0.9)] text-red-500";
    timerAnim = { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] };
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden rounded-[2rem]">
      
      {/* Game Card Ambient Effects */}
      <AnimatePresence>
        {(phase === "fire" || phase === "failure") && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "failure" ? 1 : fireIntensity * 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2rem]"
          >
            {/* Ambient Card Glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(255,50,0,0.2)]" />
            {/* Animated Edge Lighting */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-[2px] border-orange-500/20 rounded-[2rem]"
            />
            {/* Atmospheric Smoke Particles behind everything */}
            <motion.div 
              animate={{ y: [-20, -50], opacity: [0, 0.2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 blur-[100px] rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* =========================================================================
            PHASE 1: QUESTION
            ========================================================================= */}
        {phase === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto z-10 w-full"
          >
            <p className="font-mono text-xs tracking-[0.4em] text-[var(--color-accent-teal)] mb-4">SECURITY OVERRIDE</p>
            <h3 className="font-display text-3xl md:text-5xl uppercase font-bold text-white mb-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] leading-tight">
              WHAT DO I LIKE TO CALL OUR MINIPROJECT?
            </h3>
            <form onSubmit={handleAnswerSubmit} className="flex flex-col items-center w-full gap-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                className="w-full max-w-[300px] bg-black/50 border-b-2 border-[var(--color-accent-teal)] outline-none text-center font-mono text-xl text-white py-4 uppercase tracking-widest placeholder:text-white/20 transition-all focus:bg-white/5 focus:border-white"
                placeholder="ENTER ANSWER"
              />
              <button
                type="submit"
                className="group relative px-8 py-3 font-mono text-xs tracking-widest uppercase border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
              >
                SUBMIT ANSWER
              </button>
            </form>
            <div className="h-8 mt-6">
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[10px] text-red-500 tracking-widest uppercase"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            PHASE 2 & 3 & 4: THE TROLLEY EMERGENCY
            ========================================================================= */}
        {phase !== "question" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative flex flex-col w-full h-full px-4 py-8 md:py-12 z-10"
          >
            
            {/* Top UI Area (Timer & Header) */}
            <div className="flex flex-col items-center w-full shrink-0 mb-6 md:mb-10">
              <AnimatePresence mode="wait">
                {phase === "transition" && (
                  <motion.div
                    key="transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center mt-10"
                  >
                    <p className="font-mono text-[10px] text-white/50 tracking-[0.5em] mb-4">ACCESS GRANTED</p>
                    <h3 className="font-display text-2xl md:text-4xl text-white tracking-widest">LOADING MEMORY...</h3>
                  </motion.div>
                )}

                {(phase === "fire" || phase === "failure") && (
                  <motion.div
                    key="hud"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center w-full text-center"
                  >
                    <motion.div 
                      animate={timerAnim}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className={`font-display text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8 ${timerGlow} transition-colors duration-500`}
                    >
                      {timeLeft}
                    </motion.div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <motion.h2 
                        animate={{ textShadow: phase === "fire" ? ["0 0 10px rgba(255,0,0,0.5)", "0 0 20px rgba(255,0,0,0.8)", "0 0 10px rgba(255,0,0,0.5)"] : "none" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="font-display text-2xl md:text-4xl text-red-500 uppercase tracking-[0.3em]"
                      >
                        TROLLEY EMERGENCY
                      </motion.h2>
                      <p className="font-mono text-xs md:text-sm text-white/90 uppercase tracking-[0.4em]">
                        EXTINGUISH THE FIRE.
                      </p>
                    </div>
                  </motion.div>
                )}

                {phase === "success" && (
                  <motion.div
                    key="success_text"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mt-10"
                  >
                    <h3 className="font-display text-4xl md:text-6xl text-[var(--color-accent-teal)] drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] font-bold mb-4">CRISIS AVERTED.</h3>
                    <p className="font-mono text-sm md:text-base tracking-[0.4em] text-white/90 uppercase">OKAY. YOU STILL REMEMBER.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle Graphic Area: Large Portrait Image */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-0 relative mb-8">
              {/* Photo Container */}
              <motion.div
                animate={{
                  x: phase === "fire" ? [0, -0.5, 0.5, -0.2, 0.2, 0] : 0,
                  y: phase === "fire" ? [0, 0.5, -0.5, 0.5, -0.2, 0] : 0,
                  scale: phase === "failure" ? 1.05 : 1,
                  filter: phase === "failure" ? "brightness(1.5) contrast(1.2) sepia(0.5) hue-rotate(-20deg)" : "none"
                }}
                transition={{
                  x: { duration: 0.2, repeat: Infinity, repeatType: "mirror" },
                  y: { duration: 0.25, repeat: Infinity, repeatType: "mirror" },
                  scale: { duration: 0.8, ease: "easeOut" },
                  filter: { duration: 0.8 }
                }}
                className="relative h-full w-[85%] md:w-[65%] max-w-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5"
              >
                <img 
                  src="/images/trolley.jpg" 
                  alt="Trolley" 
                  className="w-full h-full object-cover" 
                  draggable={false} 
                />

                {/* Localized Fire Overlays */}
                <AnimatePresence>
                  {(phase === "fire" || phase === "failure") && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase === "failure" ? 1 : fireIntensity }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 pointer-events-none mix-blend-screen"
                    >
                      {/* Localized flames at the bottom edge */}
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0], 
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7] 
                        }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 left-[-10%] w-[120%] h-[40%] bg-orange-600/60 rounded-full blur-[40px]"
                      />
                      <motion.div 
                        animate={{ 
                          y: [0, -20, 0], 
                          scale: [1, 1.15, 1],
                          opacity: [0.6, 0.9, 0.6] 
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        className="absolute bottom-0 right-[10%] w-[50%] h-[50%] bg-yellow-500/50 rounded-full blur-[35px]"
                      />
                      <motion.div 
                        animate={{ 
                          y: [0, -30, 0], 
                          scale: [0.9, 1.1, 0.9],
                          opacity: [0.5, 0.8, 0.5] 
                        }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-red-500/40 rounded-full blur-[30px]"
                      />

                      {/* Rising Smoke inside image */}
                      <motion.div
                        animate={{ y: [0, -100], opacity: [0, 0.3, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-1/4 w-1/2 h-full bg-gradient-to-t from-transparent via-neutral-500/20 to-transparent blur-[20px]"
                      />

                      {/* Floating Embers */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: "100%", x: Math.random() * 50 - 25 }}
                          animate={{ 
                            opacity: [0, 1, 0], 
                            y: "-120%", 
                            x: Math.random() * 50 - 25 
                          }}
                          transition={{ 
                            duration: 1.5 + Math.random() * 2, 
                            repeat: Infinity, 
                            delay: Math.random() * 2 
                          }}
                          className="absolute bottom-0 left-1/2 w-1 h-1 md:w-2 md:h-2 bg-yellow-300 rounded-full blur-[1px]"
                          style={{ marginLeft: `${(Math.random() - 0.5) * 80}%` }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Heat Distortion overlay (localized to bottom half) */}
                {(phase === "fire" || phase === "failure") && (
                  <motion.div 
                    animate={{ opacity: phase === "failure" ? 1 : fireIntensity * 0.4 }}
                    className="absolute bottom-0 left-0 w-full h-[60%] backdrop-blur-[2px] pointer-events-none bg-gradient-to-t from-orange-600/10 to-transparent"
                  />
                )}
                
                {/* Failure Darkening */}
                <AnimatePresence>
                  {phase === "failure" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="absolute inset-0 bg-black pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                
                {/* Success Particle Burst */}
                <AnimatePresence>
                  {phase === "success" && (
                    <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-32 h-32 bg-white rounded-full blur-[30px]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Bottom Controls Area */}
            <div className="flex flex-col items-center w-full shrink-0">
              <AnimatePresence mode="wait">
                {phase === "fire" && (
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col items-center w-full"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExtinguish}
                      className="group relative w-full max-w-sm py-5 rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-950/80 to-red-900/40 overflow-hidden shadow-[0_10px_30px_rgba(255,0,0,0.3)] transition-all select-none border-t-red-400/50"
                    >
                      {/* Deep physical button look: inner top highlight, bottom shadow */}
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),_inset_0_-4px_10px_rgba(0,0,0,0.5)] pointer-events-none" />
                      
                      {/* Hover / Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/30 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Click Shockwaves */}
                      {shockwaves.map((wave) => (
                        <motion.div
                          key={wave.id}
                          initial={{ width: 0, height: 0, opacity: 0.8 }}
                          animate={{ width: 200, height: 200, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute rounded-full bg-white/30 pointer-events-none mix-blend-overlay"
                          style={{ top: wave.y, left: wave.x, transform: 'translate(-50%, -50%)' }}
                        />
                      ))}
                      
                      <span className="relative z-10 font-display text-2xl md:text-3xl font-bold tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                        EXTINGUISH
                      </span>
                    </motion.button>
                    
                    <motion.div 
                      layout
                      className="mt-6 font-mono text-xs md:text-sm text-white/50 tracking-[0.3em] uppercase"
                    >
                      EXTINGUISHMENT: <span className="text-white font-bold">{clicks} / 7</span>
                    </motion.div>
                  </motion.div>
                )}

                {phase === "failure" && (
                  <motion.div
                    key="failure_controls"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-red-500 tracking-[0.2em] mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">TOO LATE.</h3>
                    <p className="font-mono text-[10px] md:text-xs text-white/60 tracking-[0.4em] uppercase mb-8">THE TROLLEY DID NOT MAKE IT.</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRetry}
                      className="px-10 py-4 rounded-full border border-white/20 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                    >
                      TRY AGAIN
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
