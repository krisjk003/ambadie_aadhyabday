"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GlobalContextType {
  roastMode: boolean;
  toggleRoastMode: () => void;
  audioPlaying: boolean;
  toggleAudio: () => void;
  cameraMode: boolean;
  toggleCameraMode: () => void;
  capturedMemories: string[];
  captureMemory: (id: string) => void;
  loreFragments: string[];
  addLoreFragment: (id: string) => void;
  cursorState: "default" | "view" | "drag" | "hidden";
  setCursorState: (state: "default" | "view" | "drag" | "hidden") => void;
  forceUnlockSecret: boolean;
  setForceUnlockSecret: (val: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [roastMode, setRoastMode] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [cameraMode, setCameraMode] = useState(false);
  const [capturedMemories, setCapturedMemories] = useState<string[]>([]);
  const [loreFragments, setLoreFragments] = useState<string[]>([]);
  const [cursorState, setCursorState] = useState<"default" | "view" | "drag" | "hidden">("default");
  const [forceUnlockSecret, setForceUnlockSecret] = useState(false);
  
  // Audio state is kept simple. Real implementation would use Howler or similar for SFX.
  const toggleAudio = () => setAudioPlaying(prev => !prev);
  const toggleRoastMode = () => setRoastMode(prev => !prev);
  const toggleCameraMode = () => setCameraMode(prev => !prev);

  const captureMemory = (id: string) => {
    if (!capturedMemories.includes(id)) {
      setCapturedMemories(prev => [...prev, id]);
    }
  };

  const addLoreFragment = (id: string) => {
    if (!loreFragments.includes(id)) {
      setLoreFragments(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (roastMode) {
      document.body.classList.add("roast-mode-active");
    } else {
      document.body.classList.remove("roast-mode-active");
    }
  }, [roastMode]);

  return (
    <GlobalContext.Provider
      value={{
        roastMode, toggleRoastMode,
        audioPlaying, toggleAudio,
        cameraMode, toggleCameraMode,
        capturedMemories, captureMemory,
        loreFragments, addLoreFragment,
        cursorState, setCursorState,
        forceUnlockSecret, setForceUnlockSecret
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
}
