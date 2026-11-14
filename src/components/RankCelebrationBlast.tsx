import { useEffect, useRef } from "react";

interface RankCelebrationBlastProps {
  triggerKey: number;
  rankFocus?: 1 | 2 | 3 | "all";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vr: number;
  shape: "rect" | "circle";
}

const PALETTES: Record<1 | 2 | 3 | "all", string[]> = {
  1: ["#F59E0B", "#FBBF24", "#FEF08A", "#D97706", "#FFFFFF"],
  2: ["#94A3B8", "#CBD5E1", "#E2E8F0", "#64748B", "#38BDF8"],
  3: ["#D97706", "#B45309", "#FDBA74", "#EA580C", "#FEF3C7"],
  all: ["#F59E0B", "#FBBF24", "#94A3B8", "#38BDF8", "#EA580C", "#6366F1"],
};

export function RankCelebrationBlast({
  triggerKey,
  rankFocus = "all",
}: RankCelebrationBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const colors = PALETTES[rankFocus];
    const origins =
      rankFocus === "all"
        ? [
            { x: width * 0.28, y: height * 0.38 },
            { x: width * 0.5, y: height * 0.32 },
            { x: width * 0.72, y: height * 0.38 },
          ]
        : [{ x: width * 0.5, y: height * 0.35 }];

    const particles: Particle[] = [];
    origins.forEach((origin) => {
      const count = rankFocus === "all" ? 38 : 70;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 3 + Math.random() * 8;
        particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 4 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)] || "#F59E0B",
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.25,
          shape: Math.random() > 0.4 ? "rect" : "circle",
        });
      }
    });

    let frameId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let active = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.vx *= 0.985;
        p.rotation += p.vr;
        if (elapsed > 1100) {
          p.alpha = Math.max(0, p.alpha - 0.025);
        }

        if (p.alpha > 0.02 && p.y < height + 40) {
          active = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (active && elapsed < 2600) {
        frameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [triggerKey, rankFocus]);

  if (triggerKey <= 0) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] pointer-events-none w-screen h-screen"
    />
  );
}
