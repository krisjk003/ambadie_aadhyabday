"use client";

import React, { useEffect, useRef } from "react";

interface CosmicCelebrationProps {
  playInitialBurst?: boolean; // If false, skip the massive center burst (used for refresh)
}

export function CosmicCelebration({ playInitialBurst = true }: CosmicCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = window.innerWidth < 768;

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = window.innerWidth < 768;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Colors palette
    const colors = [
      "#FFFFFF", // White
      "#A855F7", // Violet
      "#D946EF", // Magenta
      "#06B6D4", // Cyan
      "#EAB308", // Gold
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
      isStar: boolean;
      life: number;

      constructor(x: number, y: number, isBurst: boolean = false, isBackgroundStar: boolean = false) {
        this.x = x;
        this.y = y;
        this.isStar = isBackgroundStar;
        this.life = 0;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        if (isBackgroundStar) {
          // Slow drifting stars
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift
          this.radius = Math.random() * 1.5 + 0.5;
          this.alpha = Math.random() * 0.5 + 0.1;
          this.decay = 0; // Don't decay quickly
        } else if (isBurst) {
          // Fast explosion
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 15 + 2; // high speed
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.radius = Math.random() * 2.5 + 0.5;
          this.alpha = 1;
          this.decay = Math.random() * 0.015 + 0.005; // Fade out fast
        } else {
          // Ambient gentle spawn
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = (Math.random() - 0.5) * 2;
          this.radius = Math.random() * 2 + 0.5;
          this.alpha = 1;
          this.decay = Math.random() * 0.01 + 0.005;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (!this.isStar) {
          this.alpha -= this.decay;
          // Friction
          this.vx *= 0.98;
          this.vy *= 0.98;
        } else {
          // Star twinkling
          this.life += 0.02;
          this.alpha = (Math.sin(this.life) * 0.3) + 0.4;
          
          // Wrap around screen
          if (this.y < -10) this.y = height + 10;
          if (this.x < -10) this.x = width + 10;
          if (this.x > width + 10) this.x = -10;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Add glow for larger particles
        if (this.radius > 1.5 && !isMobile) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createBurst = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, true, false));
      }
    };

    // Initialize background stars
    const backgroundStarsCount = isMobile ? 75 : 150;
    for (let i = 0; i < backgroundStarsCount; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height, false, true));
    }

    // Sequence timing
    if (playInitialBurst) {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Initial massive burst
      const mainBurstCount = isMobile ? 250 : 500;
      createBurst(centerX, centerY, mainBurstCount);

      // Timed secondary bursts
      const secondaryBurstCount = isMobile ? 100 : 200;
      const tertiaryBurstCount = isMobile ? 75 : 150;
      setTimeout(() => createBurst(centerX, centerY, secondaryBurstCount), 1000);
      setTimeout(() => createBurst(width * 0.2, height * 0.3, tertiaryBurstCount), 2500);
      setTimeout(() => createBurst(width * 0.8, height * 0.7, tertiaryBurstCount), 4000);
    }

    // Occasional mini-bursts loop
    const miniBurstInterval = setInterval(() => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      createBurst(x, y, 30);
    }, 3500);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.alpha <= 0 && !p.isStar) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(miniBurstInterval);
    };
  }, [playInitialBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
