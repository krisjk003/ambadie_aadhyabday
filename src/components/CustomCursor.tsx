"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGlobal } from "@/context/GlobalContext";

export function CustomCursor() {
  const { cursorState } = useGlobal();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setIsMobile(false);
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center mix-blend-screen"
      animate={{
        x: mousePosition.x - (cursorState === 'default' ? 2 : 32),
        y: mousePosition.y - (cursorState === 'default' ? 2 : 32),
        opacity: isVisible && cursorState !== 'hidden' ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
        cursorState === 'default' 
          ? 'w-1 h-1 bg-[var(--color-accent-teal)] shadow-[0_0_5px_var(--color-accent-teal)]' 
          : 'w-16 h-16 border border-white/20 bg-white/5 backdrop-blur-[2px]'
      }`}>
        {cursorState !== 'default' && (
          <span className="font-mono text-[9px] uppercase font-bold text-white tracking-widest absolute drop-shadow-md">
            {cursorState}
          </span>
        )}
      </div>
    </motion.div>
  );
}
