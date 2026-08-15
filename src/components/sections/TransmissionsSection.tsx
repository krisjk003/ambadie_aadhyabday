"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayData } from "@/data/birthday";
import { useGlobal } from "@/context/GlobalContext";

const BOOT_SEQUENCE = [
  "INITIALIZING SECURE CHANNEL...",
  "AUTHENTICATING USER...",
  "LOCATING TRANSMISSIONS...",
  "ENCRYPTION VERIFIED...",
  "ACCESS GRANTED."
];

const BackgroundNetwork = ({ allUnlocked }: { allUnlocked: boolean }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-[3000ms] ${allUnlocked ? 'opacity-80' : 'opacity-10'}`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = 180;
          const cx = `calc(50% + ${Math.cos(angle) * r}px)`;
          const cy = `calc(50% + ${Math.sin(angle) * r}px)`;
          return (
            <g key={i}>
              <line x1="50%" y1="50%" x2={cx} y2={cy} stroke={allUnlocked ? "rgba(137,44,220,0.6)" : "rgba(255,255,255,0.1)"} strokeWidth={allUnlocked ? "2" : "1"} strokeDasharray={allUnlocked ? "0" : "4"} className="transition-all duration-[2000ms]" />
              <circle cx={cx} cy={cy} r={allUnlocked ? "6" : "2"} fill={allUnlocked ? "#3fe0c5" : "rgba(255,255,255,0.4)"} filter="url(#glow)" className="transition-all duration-1000"/>
              
              {/* Pulsing effect when unlocked */}
              {allUnlocked && (
                <circle cx={cx} cy={cy} r="6" fill="transparent" stroke="#3fe0c5" strokeWidth="1">
                  <animate attributeName="r" values="6; 20; 6" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                  <animate attributeName="opacity" values="1; 0; 1" dur="2s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                </circle>
              )}
            </g>
          );
        })}
        <circle cx="50%" cy="50%" r={allUnlocked ? "10" : "3"} fill={allUnlocked ? "#892cdc" : "rgba(255,255,255,0.6)"} filter="url(#glow)" className="transition-all duration-[2000ms]"/>
      </svg>
    </div>
  );
};

const RedactedText = ({ text, isDecoding, isUnlocked, onComplete }: { text: string, isDecoding: boolean, isUnlocked: boolean, onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    if (isUnlocked) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          onComplete?.();
        }
      }, 15);
      return () => clearInterval(interval);
    } else {
      const redacted = text.split('').map(c => c.match(/[a-zA-Z0-9]/) ? '█' : c).join('');
      setDisplayed(redacted);
    }
  }, [text, isUnlocked]);

  return (
    <div className="relative">
      {isDecoding && (
        <motion.div 
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-[var(--color-accent-cyan)] opacity-50 blur-[2px] z-10"
        />
      )}
      <p className={`font-mono text-[10px] md:text-xs leading-loose whitespace-pre-wrap ${isUnlocked ? 'text-white' : 'text-neutral-700'}`}>
        {displayed}
      </p>
    </div>
  );
};

export function TransmissionsSection() {
  const [bootStage, setBootStage] = useState(-1);
  const { addLoreFragment, forceUnlockSecret, setForceUnlockSecret } = useGlobal();
  const [decryptionStates, setDecryptionStates] = useState<("LOCKED" | "DECODING" | "UNLOCKED")[]>(Array(5).fill("LOCKED"));
  const [finalSequenceStage, setFinalSequenceStage] = useState(0); 
  
  const allUnlocked = decryptionStates.every(s => s === "UNLOCKED");

  useEffect(() => {
    if (bootStage >= 0 && bootStage < BOOT_SEQUENCE.length) {
      const timer = setTimeout(() => {
        setBootStage(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [bootStage]);

  useEffect(() => {
    if (allUnlocked && finalSequenceStage === 0) {
      // Wait for the 5th message to be readable for a few seconds before triggering finale
      const finaleTimer = setTimeout(() => {
        setFinalSequenceStage(1); // Fade cards
        
        setTimeout(() => setFinalSequenceStage(2), 2000); // Screen darkens, text appears
        setTimeout(() => setFinalSequenceStage(3), 6000); // Button appears
      }, 6000);
      return () => clearTimeout(finaleTimer);
    }
  }, [allUnlocked, finalSequenceStage]);

  const handleDecrypt = (index: number) => {
    if (decryptionStates[index] !== "LOCKED") return;
    
    setDecryptionStates(prev => {
      const next = [...prev];
      next[index] = "DECODING";
      return next;
    });

    setTimeout(() => {
      setDecryptionStates(prev => {
        const next = [...prev];
        next[index] = "UNLOCKED";
        return next;
      });
      addLoreFragment(`transmission-${index}`);
    }, 1500);
  };

  const unlockSecret = () => {
    setForceUnlockSecret(true);
    const secretSection = document.getElementById("secret-reveal");
    if (secretSection) {
      secretSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-32 relative min-h-[120vh] border-t border-white/5 bg-[#05050A] overflow-hidden">
      
      {/* Network Background */}
      <BackgroundNetwork allUnlocked={finalSequenceStage > 0} />
      
      {/* Screen Darken Overlay during finale */}
      <motion.div 
        animate={{ opacity: finalSequenceStage >= 2 ? 0.8 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-black pointer-events-none z-0"
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Signal Indicator */}
        <div className="absolute top-0 right-4 font-mono text-[10px] text-[var(--color-accent-teal)] flex items-center gap-2">
          SIGNAL: 
          <motion.span animate={{ opacity: [1, 0.5, 1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            ▂▄▆█
          </motion.span>
        </div>

        <motion.div
          onViewportEnter={() => { if (bootStage === -1) setBootStage(0); }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 min-h-[80px]"
        >
          {bootStage < 5 && bootStage >= 0 ? (
            <div className="font-mono text-xs md:text-sm text-[var(--color-accent-teal)] text-center space-y-1">
              {BOOT_SEQUENCE.slice(0, bootStage + 1).map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ) : bootStage >= 5 && finalSequenceStage === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter mb-4 uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">INCOMING TRANSMISSIONS</h2>
            </motion.div>
          ) : null}
        </motion.div>

        {bootStage >= 5 && (
          <div className="space-y-6">
            <AnimatePresence>
              {finalSequenceStage === 0 && birthdayData.transmissions.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                  className={`border rounded-[1.5rem] overflow-hidden transition-all duration-1000 ${decryptionStates[i] === 'UNLOCKED' ? 'border-[var(--color-accent-violet)] glass-hologram bg-[var(--color-accent-violet)]/5 shadow-[0_0_30px_rgba(137,44,220,0.1)]' : 'border-white/10 bg-black/40'}`}
                >
                  <div className="p-6 md:p-8 flex flex-col gap-6 relative">
                    {/* Materialization particle effect on entrance */}
                    <motion.div 
                      initial={{ left: "-10%", opacity: 1 }}
                      animate={{ left: "100%", opacity: 0 }}
                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                      className="absolute top-0 bottom-0 w-1 bg-white blur-[2px] opacity-20 pointer-events-none"
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${decryptionStates[i] === 'UNLOCKED' ? 'bg-[var(--color-accent-cyan)] shadow-[0_0_10px_rgba(34,211,238,0.8)]' : decryptionStates[i] === 'DECODING' ? 'bg-[var(--color-accent-gold)] animate-pulse' : 'bg-red-900 animate-pulse'}`}></div>
                        <div className={`font-mono text-[10px] md:text-xs uppercase tracking-widest ${decryptionStates[i] === 'UNLOCKED' ? 'text-[var(--color-accent-cyan)]' : 'text-neutral-500'}`}>
                          {decryptionStates[i] === 'UNLOCKED' ? t.from : "SOURCE // ██████"}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDecrypt(i)}
                        disabled={decryptionStates[i] !== 'LOCKED'}
                        className={`text-[9px] font-mono border px-6 py-2 rounded-full transition-all duration-500 self-start md:self-auto uppercase tracking-widest ${
                          decryptionStates[i] === 'UNLOCKED' 
                            ? 'border-[var(--color-accent-cyan)]/30 text-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10' 
                            : decryptionStates[i] === 'DECODING'
                              ? 'border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]'
                              : 'border-white/20 text-neutral-400 hover:border-white hover:text-white cursor-pointer'
                        }`}
                      >
                        {decryptionStates[i] === 'LOCKED' ? 'DECRYPT' : decryptionStates[i] === 'DECODING' ? 'DECODING...' : 'DECRYPTED'}
                      </button>
                    </div>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-white/5 relative overflow-hidden min-h-[100px]">
                      <RedactedText text={t.message} isDecoding={decryptionStates[i] === 'DECODING'} isUnlocked={decryptionStates[i] === 'UNLOCKED'} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 5/5 Final Cinematic Sequence */}
        <AnimatePresence>
          {finalSequenceStage >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 flex flex-col items-center justify-center min-h-[50vh] z-20 pointer-events-none"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="text-center space-y-6 mb-16"
              >
                <h2 className="font-mono text-sm md:text-base text-[var(--color-accent-cyan)] tracking-[0.5em] uppercase">ALL TRANSMISSIONS DECRYPTED.</h2>
                <h3 className="font-display text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  SIGNAL CLEAR.<br/>NO MORE SECRETS.
                </h3>
                <p className="font-mono text-sm tracking-[0.4em] uppercase text-[var(--color-accent-gold)] pt-4">HAPPY BIRTHDAY.</p>
              </motion.div>
              
              <AnimatePresence>
                {finalSequenceStage >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    onClick={unlockSecret}
                    className="pointer-events-auto group relative px-10 py-4 rounded-full border border-[var(--color-accent-magenta)] bg-[var(--color-accent-magenta)]/10 hover:bg-[var(--color-accent-magenta)] hover:text-white transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.2)] cursor-pointer"
                  >
                    <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-3">
                      [ CLASSIFIED FILE UNLOCKED ]
                      <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.span>
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
