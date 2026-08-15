"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/sections/HeroSection";
import { CharactersSection } from "@/components/sections/CharactersSection";
import { ConstellationSection } from "@/components/sections/ConstellationSection";
import { MemoryDeckSection } from "@/components/sections/MemoryDeckSection";
import { SecretRevealSection } from "@/components/sections/SecretRevealSection";
import { TransmissionsSection } from "@/components/sections/TransmissionsSection";
import { AlternateUniverseSection } from "@/components/sections/AlternateUniverseSection";
import { FinalCinematicSection } from "@/components/sections/FinalCinematicSection";

import { CustomCursor } from "@/components/CustomCursor";
import { RoastModeToggle } from "@/components/RoastModeToggle";
import { CameraMode } from "@/components/CameraMode";
import { PhotoRoulette } from "@/components/PhotoRoulette";
import { KonamiEgg } from "@/components/KonamiEgg";
import { LoreProgress } from "@/components/LoreProgress";
import { AudioController } from "@/components/AudioController";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[#F8F9FA] selection:bg-[var(--color-accent-violet)] selection:text-white">
      <CustomCursor />
      <KonamiEgg />
      
      <HeroSection onEnter={() => setHasEntered(true)} />
      
      {hasEntered && (
        <>
          <AudioController />
          <LoreProgress />
          <CameraMode />
          <RoastModeToggle />
          <PhotoRoulette />

          <CharactersSection />
          <ConstellationSection />
          <MemoryDeckSection />
          <SecretRevealSection />
          <TransmissionsSection />
          <AlternateUniverseSection />
          <FinalCinematicSection />
        </>
      )}
    </main>
  );
}
