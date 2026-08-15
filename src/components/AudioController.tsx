"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { birthdayData } from "@/data/birthday";

export function AudioController() {
  const { audioPlaying, toggleAudio } = useGlobal();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio(birthdayData.audio.bgMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const playAudio = () => {
      if (audioPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          window.removeEventListener("click", playAudio);
          window.removeEventListener("touchstart", playAudio);
        }).catch(() => {});
      }
    };

    if (audioRef.current && mounted) {
      if (audioPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay was blocked, add listeners for user interaction
          window.addEventListener("click", playAudio);
          window.addEventListener("touchstart", playAudio);
        });
      } else {
        audioRef.current.pause();
        window.removeEventListener("click", playAudio);
        window.removeEventListener("touchstart", playAudio);
      }
    }

    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };
  }, [audioPlaying, mounted]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-8 right-8 z-50 font-mono text-[9px] uppercase tracking-[0.4em] px-5 py-3 text-white/50 hover:text-white transition-all duration-300 flex items-center gap-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30"
    >
      <div className="flex gap-[2px] items-end h-2">
        <div className={`w-[1px] bg-current transition-all duration-300 ${audioPlaying ? 'h-2 animate-[pulse_1s_ease-in-out_infinite]' : 'h-1'}`}></div>
        <div className={`w-[1px] bg-current transition-all duration-300 delay-75 ${audioPlaying ? 'h-1 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-0.5'}`}></div>
        <div className={`w-[1px] bg-current transition-all duration-300 delay-150 ${audioPlaying ? 'h-full animate-[pulse_1.2s_ease-in-out_infinite]' : 'h-1'}`}></div>
      </div>
      {audioPlaying ? 'AUDIO ACTIVE' : 'AUDIO MUTED'}
    </button>
  );
}
