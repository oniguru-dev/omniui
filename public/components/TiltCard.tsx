/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import type { JSX, ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';

export interface TiltCardProps {
  children: ComponentChildren;
  class?: string;
}

export function TiltCard({ children, class: className = '' }: TiltCardProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0); // requestAnimationFrame

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    if (raf.current) return;

    raf.current = requestAnimationFrame(() => {
      raf.current = 0; const element = ref.current;
      if (!element) return; // element not found

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const centerX = rect.width / 2; const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      element.style.transition = 'transform 0.1s ease-out';
    });
  };

  const handleMouseLeave = () => {
    const element = ref.current; if (!element) return;
    element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    element.style.transition = 'transform 0.5s ease-in';
  };

  return (
    <div class={`will-change-transform rounded-3xl ${className}`}
      ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      role="group" aria-label="Interactive tilt card"
      style={{ boxShadow: '0 0 0 1px var(--border), 0 4px 24px rgba(0,0,0,0.08)' }}
    >{children}</div>
  );
};