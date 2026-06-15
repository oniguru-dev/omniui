/** @jsxImportSource preact */
import { type JSX } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

interface GradientProps {
  children: any;
  class?: string;
  target?: string;
}

export function Gradient({ children, class: className = '', target }: GradientProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById('gradient-style')) {
      const style = document.createElement('style');
      style.id = 'gradient-style'; style.textContent = `
.gradient-root {
  position: relative;
  overflow: hidden;
}
.gradient-root::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  left: calc(var(--gx, 50%) - 150px);
  top: calc(var(--gy, 50%) - 150px);
  background: radial-gradient(
    circle,
    rgba(128, 64, 255, 0.3) 0%,
    rgba(128, 64, 255, 0.1) 30%,
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  transition: left 0.12s ease-out, top 0.12s ease-out;
}
.gradient-root > * {
  position: relative;
  z-index: 1;
}`;

      document.head.appendChild(style);
    }

    const element: HTMLElement | null = target
      ? document.querySelector(target) : ref.current;
    if (!element) return;

    const root = ref.current;
    let raf: number | null = null;
    let pos = { x: 50, y: 50 };
    let tgt = { x: 50, y: 50 };

    const animate = () => {
      if (!root) return;

      pos.x += (tgt.x - pos.x) * 0.12;
      pos.y += (tgt.y - pos.y) * 0.12;

      root.style.setProperty('--gx', `${pos.x}%`);
      root.style.setProperty('--gy', `${pos.y}%`);

      if (Math.abs(pos.x - tgt.x) > 0.05 || Math.abs(pos.y - tgt.y) > 0.05) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
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
    <div
      ref={ref} class={`gradient-root ${className}`}
      style={{ '--gx': '50%', '--gy': '50%' }}
    >
      {children}
    </div>
  );
}
