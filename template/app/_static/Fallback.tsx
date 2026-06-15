/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { useEffect, useRef } from 'preact/hooks';

export default function FallbackPage() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--colors-accent').trim();

  useEffect(() => {
    const _eta = ref.current; if (!_eta) return;
    const _ctx = _eta.getContext('2d'); if (!_ctx) return;
    const eta = _eta; const ctx = _ctx;

    let id = 0; let w = 0; let h = 0;
    const d = new Float32Array(50 * 5);
    const v = new Float32Array(50 * 2);

    function resize() {
      w = innerWidth; h = innerHeight;
      eta.width = w; eta.height = h;
    }

    function reset(i: number, spread: boolean) {
      const opt = i * 5; const seq = i * 2;

      // x, y
      d[opt] = spread ? Math.random() * w * 1.5
        : w + Math.random() * w * 0.3;
      d[opt + 1] = spread ? Math.random() * h * 1.5
        : Math.random() * h;

      // size, angle, alpha
      d[opt + 2] = 0.2 + Math.random() * 0.4;
      d[opt + 3] = Math.random() * 6.28;
      d[opt + 4] = Math.random() * 0.3 + 0.7;

      // vx, vy
      v[seq] = 0.3 + Math.random() * 0.6;
      v[seq + 1] = 0.15 + Math.random() * 0.35;
    }

    resize(); // set initial size and position
    for (let i = 0; i < 50; i++) reset(i, true);
    addEventListener('resize', resize);

    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 50; i++) {
        const opt = i * 5; const seq = i * 2;

        d[opt]! -= v[seq]!;
        d[opt + 1]! -= v[seq + 1]!;
        d[opt + 3]! += 0.01;

        if (d[opt]! < -50 || d[opt + 1]! < -50) {
          reset(i, false); continue; // out of bounds
        }

        // transform
        ctx.save(); ctx.globalAlpha = d[opt + 4]!;
        ctx.translate(d[opt]!, d[opt + 1]!); ctx.rotate(d[opt + 3]!);
        ctx.scale(d[opt + 2]!, d[opt + 2]!); ctx.fillStyle = accent;

        // draw
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.bezierCurveTo(12, -14, 32, -10, 36, 0);
        ctx.bezierCurveTo(32, 10, 12, 14, 0, 0);
        ctx.fill(); ctx.restore();
      }

      id = requestAnimationFrame(draw);
    }

    id = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(id);
      removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div class="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <canvas ref={ref} class="absolute inset-0 w-full h-full" /><div class="relative z-1">
        <div class="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    </div>
  );
}
