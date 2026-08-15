"use client";

import { motion, Variants } from "framer-motion";
import { birthdayData } from "@/data/birthday";
import { PhotoCard } from "@/components/PhotoCard";

const GatheringParticles = ({ color }: { color: string }) => {
  const particles = Array.from({ length: 15 }).map((_, i) => {
    const angle = (i / 15) * Math.PI * 2;
    const radius = 150 + Math.random() * 100;
    return {
      id: i,
      xStart: Math.cos(angle) * radius,
      yStart: Math.sin(angle) * radius,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random(),
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: p.xStart, y: p.yStart, scale: 0 }}
          whileInView={{ opacity: [0, 1, 0], x: 0, y: 0, scale: [0, 1, 0] }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeInOut" }}
          className="absolute w-1 h-1 rounded-full shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: color, color: color }}
        />
      ))}
    </div>
  );
};

export function CharactersSection() {
  const cardSequence: Variants = {
    hidden: { opacity: 0, filter: "blur(30px)", y: 40 },
    visible: { 
      opacity: [0, 0.1, 1], 
      filter: ["blur(30px)", "blur(20px)", "blur(0px)"], 
      y: [40, 20, 0],
      transition: { duration: 3, times: [0, 0.4, 1], ease: "easeOut", delay: 0.5 }
    }
  };

  const glowSequence: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: [0, 0.5, 1],
      scale: [0.5, 1.2, 1],
      transition: { duration: 4, times: [0, 0.5, 1], ease: "easeInOut" }
    }
  };

  const textSequence: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { 
      opacity: 1, filter: "blur(0px)", y: 0,
      transition: { duration: 2, delay: 2.5, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen py-32 flex flex-col items-center justify-center relative bg-transparent overflow-hidden">
      
      {/* Cinematic light sweeps */}
      <div className="absolute top-1/4 left-0 w-[80vw] h-[80vh] bg-[var(--color-accent-gold)]/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none transform -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-[80vw] h-[80vh] bg-[var(--color-accent-violet)]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none transform translate-x-1/2"></div>
      
      <div className="z-10 container mx-auto px-4 max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center mb-32"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase">THE MAIN CHARACTERS</h2>
          <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent mx-auto mt-8"></div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          {/* Person 01 */}
          <div className="flex flex-col items-center relative group">
            <GatheringParticles color="var(--color-accent-gold)" />
            
            <motion.div 
              variants={glowSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="absolute inset-0 bg-[var(--color-accent-gold)]/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[var(--color-accent-gold)]/20 group-hover:scale-110"
            />
            
            <motion.div 
              variants={cardSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-[300px] h-[400px] md:w-[400px] md:h-[530px] mb-12 relative z-10 transition-transform duration-700"
            >
              <div className="w-full h-full relative">
                {/* Cinematic Border Resolve */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: [0, 0, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 3, times: [0, 0.6, 1], delay: 0.5 }}
                  className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-white/30 to-transparent z-20 pointer-events-none"
                  style={{ maskImage: "linear-gradient(black, transparent)" }}
                />
                <PhotoCard 
                  realSrc="/images/ambadi/portrait-real.jpeg"
                  cartoonSrc="/images/ambadi/portrait-cartoon.jpeg"
                  className="w-full h-full shadow-[0_0_50px_rgba(244,201,93,0.1)] group-hover:shadow-[0_0_80px_rgba(244,201,93,0.3)]"
                />
              </div>
            </motion.div>
            
            <motion.h3 
              variants={textSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter text-[var(--color-accent-gold)] drop-shadow-[0_0_15px_rgba(244,201,93,0.5)]"
            >
              {birthdayData.names.person1}
            </motion.h3>
          </div>

          {/* Connection Line (Desktop only) */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: 256, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
            className="hidden md:block relative w-px bg-gradient-to-b from-transparent via-white/20 to-transparent flex-shrink-0"
          >
            <motion.div 
              animate={{ y: [0, 256, 0] }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-white/50 blur-[2px] rounded-full"
            />
          </motion.div>

          {/* Person 02 */}
          <div className="flex flex-col items-center relative group">
            <GatheringParticles color="var(--color-accent-cyan)" />
            
            <motion.div 
              variants={glowSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="absolute inset-0 bg-[var(--color-accent-cyan)]/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[var(--color-accent-cyan)]/20 group-hover:scale-110"
            />
            
            <motion.div 
              variants={cardSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="w-[300px] h-[400px] md:w-[400px] md:h-[530px] mb-12 relative z-10 transition-transform duration-700"
            >
              <div className="w-full h-full relative">
                {/* Cinematic Border Resolve */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: [0, 0, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 3, times: [0, 0.6, 1], delay: 0.5 }}
                  className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-white/30 to-transparent z-20 pointer-events-none"
                  style={{ maskImage: "linear-gradient(black, transparent)" }}
                />
                <PhotoCard 
                  realSrc="/images/aadhya/portrait-real.jpeg"
                  cartoonSrc="/images/aadhya/portrait-cartoon.jpeg"
                  className="w-full h-full shadow-[0_0_50px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_80px_rgba(34,211,238,0.3)]"
                />
              </div>
            </motion.div>
            
            <motion.h3 
              variants={textSequence}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter text-[var(--color-accent-cyan)] drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              {birthdayData.names.person2}
            </motion.h3>
          </div>
        </div>
      </div>
    </section>
  );
}
