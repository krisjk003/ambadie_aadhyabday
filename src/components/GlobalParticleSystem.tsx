"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  type: "dust" | "star" | "special";
  alpha: number;
  targetAlpha: number;
  orbitAngle: number;
  orbitRadius: number;

  constructor(width: number, height: number, type: "dust" | "star" | "special") {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.type = type;
    
    if (type === "dust") {
      this.size = Math.random() * 1.5;
      this.speedX = (Math.random() - 0.5) * 0.1;
      this.speedY = -Math.random() * 0.1;
      this.alpha = Math.random() * 0.3;
      this.targetAlpha = this.alpha;
      this.color = `rgba(200, 180, 255, ${this.alpha})`;
    } else if (type === "star") {
      this.size = Math.random() * 1;
      this.speedX = (Math.random() - 0.5) * 0.05;
      this.speedY = (Math.random() - 0.5) * 0.05;
      this.alpha = Math.random() * 0.8;
      this.targetAlpha = this.alpha;
      this.color = `rgba(255, 255, 255, ${this.alpha})`;
    } else {
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.6;
      this.targetAlpha = this.alpha;
      this.color = `rgba(192, 91, 244, ${this.alpha})`; // magenta/violet glow
    }
    
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitRadius = Math.random() * 50 + 20;
  }

  update(width: number, height: number, mouseX: number, mouseY: number, isHovering: boolean) {
    // Basic movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Twinkle effect for stars
    if (this.type === "star") {
      if (Math.random() < 0.01) {
        this.targetAlpha = Math.random() * 0.8;
      }
      this.alpha += (this.targetAlpha - this.alpha) * 0.05;
      this.color = `rgba(255, 255, 255, ${this.alpha})`;
    }

    // Magnetic space effect - cursor interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceSq = dx * dx + dy * dy;
    
    if (distanceSq < 40000 && isHovering) {
      const distance = Math.sqrt(distanceSq);
      // Subtle magnetic pull
      const force = (200 - distance) / 200;
      this.x += dx * force * 0.01;
      this.y += dy * force * 0.01;
      
      // Brighten near cursor
      if (this.type === "star" || this.type === "special") {
        this.color = `rgba(255, 255, 255, ${Math.min(1, this.alpha + force * 0.5)})`;
      }
    } else if (this.type === "special") {
      // Gentle orbital drift for special particles
      this.orbitAngle += 0.005;
      this.x += Math.cos(this.orbitAngle) * 0.2;
      this.y += Math.sin(this.orbitAngle) * 0.2;
      this.color = `rgba(192, 91, 244, ${this.alpha})`;
    } else if (this.type === "dust") {
       this.color = `rgba(200, 180, 255, ${this.alpha})`;
    }

    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    if (this.type === "special") {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
      gradient.addColorStop(0, `rgba(192, 91, 244, ${this.alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(192, 91, 244, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
}

export function GlobalParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust count based on mobile/desktop
    const isMobile = width < 768;
    const dustCount = isMobile ? 30 : 100;
    const starCount = isMobile ? 30 : 120;
    const specialCount = isMobile ? 3 : 10;

    const particles: Particle[] = [];
    
    // Init particles
    for (let i = 0; i < dustCount; i++) particles.push(new Particle(width, height, "dust"));
    for (let i = 0; i < starCount; i++) particles.push(new Particle(width, height, "star"));
    for (let i = 0; i < specialCount; i++) particles.push(new Particle(width, height, "special"));

    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;
    let isVisible = true;
    let lastMouseTime = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime > 16) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isHovering = true;
        lastMouseTime = now;
      }
    };
    
    const handleMouseLeave = () => {
      isHovering = false;
    };

    // Performance: Pause animation when not visible
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let animationFrameId: number;

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        
        // Draw soft ambient gradient near cursor
        if (isHovering) {
          const ambient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
          ambient.addColorStop(0, 'rgba(75, 29, 130, 0.05)'); // subtle violet glow
          ambient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = ambient;
          ctx.fillRect(0, 0, width, height);
        }

        particles.forEach(p => {
          p.update(width, height, mouseX, mouseY, isHovering);
          p.draw(ctx);
        });
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
