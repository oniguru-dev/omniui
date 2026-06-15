/** @jsxImportSource preact */
import { type JSX } from 'preact';
import { type ComponentChildren } from 'preact';
import { useRef } from 'preact/hooks';

export function TiltCard({ children, class: className = '' }:
  { children: ComponentChildren; class?: string }
): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const centerX = rect.width / 2; const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = 'transform 0.5s ease-in';
  };

  return ( <div
    ref={ref}
    onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
    class={`will-change-transform ${className}`}
  > {children} </div> );
};