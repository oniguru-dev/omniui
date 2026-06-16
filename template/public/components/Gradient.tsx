import type { JSX, ComponentChildren } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

export function Gradient({ children, class: className = '', target }: {
  children: ComponentChildren; class?: string; target?: string;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element: HTMLElement | null = target
      ? document.querySelector(target) : ref.current;
    if (!element) return;

    const root = ref.current;
    const glow = glowRef.current;
    let raf: number | null = null;
    let pos = { x: 50, y: 50 };
    let tgt = { x: 50, y: 50 };

    const animate = () => {
      if (!root || !glow) return;

      pos.x += (tgt.x - pos.x) * 0.12;
      pos.y += (tgt.y - pos.y) * 0.12;

      glow.style.left = `calc(${pos.x}% - 150px)`;
      glow.style.top = `calc(${pos.y}% - 150px)`;

      if (Math.abs(pos.x - tgt.x) > 0.05
        || Math.abs(pos.y - tgt.y) > 0.05
      ) raf = requestAnimationFrame(animate);

      else raf = null;
    };

    const onMove = (e: MouseEvent) => {
      const rect = (target ? element : ref.current)
        ?.getBoundingClientRect(); if (!rect) return;

      tgt = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };

      if (!raf) raf = requestAnimationFrame(
        () => { raf = null; animate(); }
      );
    };

    const onLeave = () => {
      tgt = { x: 50, y: 50 };

      if (!raf) raf = requestAnimationFrame(
        () => { raf = null; animate(); }
      );
    };

    element.addEventListener('mousemove', onMove);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mousemove', onMove);
      element.removeEventListener('mouseleave', onLeave);
    };
  }, [target]);

  return (
    <div ref={ref} class={`relative overflow-hidden ${className}`}>
      <div ref={glowRef}
        class="absolute size-75 rounded-full pointer-events-none z-0 transition-all duration-100 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(128,64,255,0.3) 0%, rgba(128,64,255,0.1) 30%, transparent 70%)' }}
      />
      <div class="relative z-10">{children}</div>
    </div>
  );
}
