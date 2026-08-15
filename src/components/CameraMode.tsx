"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "@/context/GlobalContext";

export function CameraMode() {
  const { cameraMode, toggleCameraMode, capturedMemories } = useGlobal();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setIsMobile(false);
    }
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    if (cameraMode) {
      window.addEventListener("mousemove", updateMousePosition);
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.body.style.cursor = "auto";
    };
  }, [cameraMode]);

  return (
    <>
      <button 
        onClick={toggleCameraMode}
        className={`fixed bottom-6 left-6 z-50 font-mono text-[9px] uppercase tracking-[0.3em] px-4 py-2 transition-all ${
          cameraMode ? 'text-[var(--color-accent-cyan)] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-white/50 hover:text-white'
        }`}
      >
        [ {cameraMode ? "EXIT CAMERA" : "CAMERA"} ]
      </button>

      <AnimatePresence>
        {cameraMode && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-none mix-blend-difference"
          >
            {/* Screen Borders */}
            <div className="absolute inset-0 border-[2px] border-white/20 m-4 rounded-[2rem]"></div>
            
            {/* Viewfinder crosshairs at mouse position */}
            <motion.div 
              className="absolute w-64 h-64"
              animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
            >
              {/* Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white"></div>
              
              {/* Center point */}
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Status */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 font-mono text-[10px] text-white tracking-widest whitespace-nowrap">
                REC • {capturedMemories.length} CAPTURED
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
