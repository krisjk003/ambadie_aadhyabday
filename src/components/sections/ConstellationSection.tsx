"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ConstellationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };
    window.addEventListener("resize", handleResize);

    // Star generation
    const stars: { x: number, y: number, radius: number, alpha: number, speed: number }[] = [];
    const initStars = () => {
      stars.length = 0;
      const count = Math.floor((width * height) / 3000); 
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          alpha: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.015,
        });
      }
    };
    initStars();

    const constellationPoints = [
      { rx: 0.35, ry: 0.4 }, 
      { rx: 0.45, ry: 0.3 },
      { rx: 0.55, ry: 0.32 },
      { rx: 0.6, ry: 0.4 },
      { rx: 0.55, ry: 0.5 },
      { rx: 0.45, ry: 0.55 },
      { rx: 0.38, ry: 0.5 },
      { rx: 0.25, ry: 0.6 },
      { rx: 0.2, ry: 0.55 },
    ];
    
    const connections = [
      [0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0],
      [6,7], [7,8]
    ];

    let animationFrame: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background stars
      stars.forEach(star => {
        star.alpha += star.speed;
        const currentAlpha = Math.abs(Math.sin(star.alpha)) * 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();
      });

      // Draw Constellation
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.6; 

      const mappedPoints = constellationPoints.map(p => ({
        x: cx + (p.rx - 0.5) * scale,
        y: cy + (p.ry - 0.5) * scale,
      }));

      // Sequence the reveal over time (0 to 1)
      const revealProgress = Math.min(1, time / 150);
      
      if (revealProgress > 0) {
        // Lines
        ctx.lineWidth = 0.5;
        connections.forEach(([i, j], index) => {
          // Stagger the lines drawing
          const lineRevealStart = index * 0.05;
          if (revealProgress < lineRevealStart) return;
          
          const p1 = mappedPoints[i];
          const p2 = mappedPoints[j];
          
          const lineAlpha = (0.15 + Math.sin(time * 0.05) * 0.05) * Math.min(1, (revealProgress - lineRevealStart) * 5);
          ctx.strokeStyle = `rgba(224, 242, 254, ${lineAlpha})`; // Very light cyan/white
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Constellation Stars
        mappedPoints.forEach((p, i) => {
          const starRevealStart = i * 0.05;
          if (revealProgress < starRevealStart) return;
          
          const visibility = Math.min(1, (revealProgress - starRevealStart) * 5);
          const starAlpha = (0.7 + Math.sin(time * 0.05 + i) * 0.3) * visibility;
          
          // Glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${starAlpha})`);
          gradient.addColorStop(0.3, `rgba(34, 211, 238, ${starAlpha * 0.4})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      time += 1;
      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [isInView]);

  return (
    <section ref={sectionRef} className="h-screen relative flex flex-col items-center justify-center bg-transparent overflow-hidden border-t border-white/5">
      {/* Dark violet gradient background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-accent-violet)]/10 via-transparent to-transparent opacity-40 mix-blend-screen pointer-events-none"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"></canvas>

      <div className="z-10 absolute top-24 text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-[var(--color-accent-cyan)] uppercase mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">THE SKY, ON THAT NIGHT</p>
          <h2 className="font-display text-3xl md:text-5xl text-white uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">AUGUST 18, 2026</h2>
        </motion.div>
      </div>
    </section>
  );
}
